
import React from 'react';
import Header from '@/components/Header';
import CoverLetterForm from '@/components/CoverLetterForm';
import CoverLetterPreview from '@/components/CoverLetterPreview';
import AIAssistant from '@/components/AIAssistant';
import { PaymentModal } from '@/components/payment';
import { Helmet } from 'react-helmet';
import { FeedbackButton } from '@/components/FeedbackDialog';
import { useCoverLetter } from '@/hooks/use-cover-letter';

const Index = () => {
  const {
    coverLetterContent,
    isGenerating,
    userName,
    companyName,
    showPaymentModal,
    setShowPaymentModal,
    handleGenerate,
    handlePaymentSuccess
  } = useCoverLetter();

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
          <div className="flex flex-col items-center gap-2">
            <p>Powered by Secret AI</p>
            <FeedbackButton />
          </div>
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
