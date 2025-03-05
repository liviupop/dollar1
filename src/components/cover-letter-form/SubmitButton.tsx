
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronRight } from 'lucide-react';

interface SubmitButtonProps {
  isGenerating: boolean;
  isFormValid: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isGenerating, isFormValid }) => {
  return (
    <Button 
      type="submit" 
      disabled={!isFormValid || isGenerating}
      className="w-full bg-teal hover:bg-teal-dark text-white transition-all"
    >
      {isGenerating ? (
        <div className="flex items-center justify-center">
          <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
          Generating...
        </div>
      ) : (
        <div className="flex items-center justify-center">
          Generate Cover Letter
          <ChevronRight className="ml-1 h-4 w-4" />
        </div>
      )}
    </Button>
  );
};

export default SubmitButton;
