
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-6 sm:px-10 flex flex-col items-center bg-transparent">
      <div className="w-full flex justify-between items-center mb-4">
        <div className="w-[15%] flex items-center">
          <img 
            src="/lovable-uploads/bded7d7d-aa10-411d-a6c0-6eface5c7406.png" 
            alt="1 Dollar Cover Letter - First one for free" 
            className="h-auto w-auto max-h-16 sm:max-h-20 object-contain"
          />
        </div>
        
        <div className="w-[70%] text-center">
          <h1 className="text-xl sm:text-2xl font-heading font-bold">
            AI-Powered Cover Letter Generator
          </h1>
        </div>
        
        <div className="w-[15%] flex items-center justify-end space-x-1">
          <span className="h-2 w-2 rounded-full bg-mint-dark animate-pulse-gentle"></span>
          <span className="text-sm font-extralight text-muted-foreground whitespace-nowrap">AI Ready</span>
        </div>
      </div>
      
      <p className="text-muted-foreground max-w-2xl mx-auto text-center">
        Our advanced AI technology crafts personalized, professional cover letters tailored to your skills and the job description.
        Get your first cover letter completely free!
      </p>
    </header>
  );
};

export default Header;
