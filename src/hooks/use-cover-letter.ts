
import { useState } from 'react';
import { toast } from '@/components/ui/sonner';
import { GenerateCoverLetterParams, generateCoverLetter as geminiGenerateCoverLetter } from '@/lib/gemini';
import { hasFreeGeneration, markFreeGenerationUsed } from '@/lib/stripe';
import { saveUserStats, saveToLocalStorage } from '@/services/analytics';

export const useCoverLetter = () => {
  const [coverLetterContent, setCoverLetterContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [userName, setUserName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingParams, setPendingParams] = useState<GenerateCoverLetterParams | null>(null);

  /**
   * Handles the generation of cover letters, including payment flow if needed
   */
  const handleGenerate = async (params: GenerateCoverLetterParams) => {
    console.log("handleGenerate called with params:", params);
    
    // Store form data in localStorage for analytics
    saveToLocalStorage(params);
    
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

  /**
   * Internal function that handles the actual API call and result processing
   */
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
      
      // Save analytics data
      saveToLocalStorage(params, generatedText);
      await saveUserStats(params, generatedText, usesFreeGeneration);
      
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

  /**
   * Called after successful payment to continue with generation
   */
  const handlePaymentSuccess = async () => {
    if (pendingParams) {
      await generateCoverLetterInternal(pendingParams, false);
      setPendingParams(null);
    }
  };

  return {
    coverLetterContent,
    isGenerating,
    userName,
    companyName,
    showPaymentModal,
    setShowPaymentModal,
    handleGenerate,
    handlePaymentSuccess
  };
};
