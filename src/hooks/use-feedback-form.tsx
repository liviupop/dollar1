
import { useState, useCallback, createContext, useContext } from 'react';

type FeedbackFormContextType = {
  showFeedbackForm: boolean;
  openFeedbackForm: () => void;
  closeFeedbackForm: () => void;
  toggleFeedbackForm: () => void;
};

const FeedbackFormContext = createContext<FeedbackFormContextType | undefined>(undefined);

export function FeedbackFormProvider({ children }: { children: React.ReactNode }) {
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  
  const openFeedbackForm = useCallback(() => setShowFeedbackForm(true), []);
  const closeFeedbackForm = useCallback(() => setShowFeedbackForm(false), []);
  const toggleFeedbackForm = useCallback(() => setShowFeedbackForm(prev => !prev), []);
  
  return (
    <FeedbackFormContext.Provider value={{
      showFeedbackForm,
      openFeedbackForm,
      closeFeedbackForm,
      toggleFeedbackForm
    }}>
      {children}
    </FeedbackFormContext.Provider>
  );
}

export function useFeedbackForm() {
  const context = useContext(FeedbackFormContext);
  
  if (context === undefined) {
    throw new Error('useFeedbackForm must be used within a FeedbackFormProvider');
  }
  
  return context;
}
