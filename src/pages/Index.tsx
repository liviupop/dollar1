
import React, { useState } from 'react';
import Header from '@/components/Header';
import CoverLetterForm from '@/components/CoverLetterForm';
import CoverLetterPreview from '@/components/CoverLetterPreview';
import AIAssistant from '@/components/AIAssistant';
import { PaymentModal } from '@/components/payment';
import { GenerateCoverLetterParams, generateCoverLetter as geminiGenerateCoverLetter } from '@/lib/gemini';
import { hasFreeGeneration, markFreeGenerationUsed } from '@/lib/stripe';
import { useToast } from '@/components/ui/use-toast';
import { toast } from '@/components/ui/sonner';
import { Helmet } from 'react-helmet';

const Index = () => {
  const [coverLetterContent, setCoverLetterContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [userName, setUserName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingParams, setPendingParams] = useState<GenerateCoverLetterParams | null>(null);
  const { toast: toastOld } = useToast();

  const handleGenerate = async (params: GenerateCoverLetterParams) => {
    console.log("handleGenerate called with params:", params);
    
    // Add test bypass - if name is "testtest", skip payment
    const isTestUser = params.name.toLowerCase() === "testtest";
    
    // Check if the user has a free generation available or is a test user
    if (!hasFreeGeneration() && !isTestUser) {
      setPendingParams(params);
      setShowPaymentModal(true);
      return;
    }

    // For test users, we don't count this as a free generation
    await generateCoverLetterInternal(params, !isTestUser && hasFreeGeneration());
  };

  const generateCoverLetterInternal = async (params: GenerateCoverLetterParams, usesFreeGeneration: boolean) => {
    console.log("generateCoverLetterInternal called with params:", params);
    setIsGenerating(true);
    setUserName(params.name);
    setCompanyName(params.company);
    setCoverLetterContent('');
    
    try {
      console.log("Calling Gemini API...");
      const generatedText = await geminiGenerateCoverLetter(params);
      console.log("Received response from Gemini API");
      
      setCoverLetterContent(generatedText);
      
      if (generatedText.includes("Error")) {
        toast.error("There was an error generating your cover letter. Please try again.");
      } else {
        toast.success("Your cover letter has been generated!");
        
        // Mark the free generation as used if this was a free generation
        if (usesFreeGeneration) {
          markFreeGenerationUsed();
        }
      }
    } catch (error) {
      console.error("Error in handleGenerate:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePaymentSuccess = async () => {
    if (pendingParams) {
      await generateCoverLetterInternal(pendingParams, false);
      setPendingParams(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-page">
      <Helmet>
        <title>1 Dollar Cover Letter | AI Cover Letter Generator</title>
        <meta name="description" content="Generate professional cover letters with AI. First one free, then just $1 per letter. Personalized for any job application." />
        <meta name="keywords" content="cover letter, AI cover letter, job application, resume helper, professional cover letter, cover letter generator" />
        <meta property="og:title" content="1 Dollar Cover Letter | AI Cover Letter Generator" />
        <meta property="og:description" content="Generate professional cover letters with AI. First one free, then just $1 per letter." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="1 Dollar Cover Letter | AI Cover Letter Generator" />
        <meta name="twitter:description" content="Generate professional cover letters with AI. First one free, then just $1 per letter." />
      </Helmet>
      <div className="max-w-6xl mx-auto px-4 py-4">
        <Header />
        
        <main className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <AIAssistant />
              <CoverLetterForm 
                onGenerate={handleGenerate} 
                isGenerating={isGenerating}
              />
            </div>
            
            <div>
              <CoverLetterPreview 
                content={coverLetterContent} 
                isGenerating={isGenerating}
                name={userName}
                company={companyName}
              />
            </div>
          </div>
        </main>
        
        <footer className="mt-12 mb-6 text-center text-sm text-muted-foreground">
          <p>Powered by Secret AI</p>
        </footer>
      </div>
      
      <PaymentModal 
        open={showPaymentModal}
        onOpenChange={setShowPaymentModal}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default Index;
