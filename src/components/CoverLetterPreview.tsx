import React, { useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Copy, Check } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface CoverLetterPreviewProps {
  content: string;
  isGenerating: boolean;
  name: string;
  company: string;
}

const CoverLetterPreview: React.FC<CoverLetterPreviewProps> = ({ 
  content, 
  isGenerating,
  name,
  company
}) => {
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [paragraphs, setParagraphs] = React.useState<string[]>([]);
  const [displayedChars, setDisplayedChars] = React.useState<number>(0);
  const [totalChars, setTotalChars] = React.useState<number>(0);

  useEffect(() => {
    if (content && !isGenerating) {
      const contentParagraphs = content.split('\n').filter(p => p.trim() !== '');
      setParagraphs(contentParagraphs);
      setTotalChars(content.length);
      setDisplayedChars(0);
    }
  }, [content, isGenerating]);

  useEffect(() => {
    if (totalChars > 0 && displayedChars < totalChars) {
      const timer = setTimeout(() => {
        setDisplayedChars(prev => Math.min(prev + 5, totalChars));
      }, 1);
      return () => clearTimeout(timer);
    }
  }, [displayedChars, totalChars]);

  const copyToClipboard = () => {
    if (content) {
      navigator.clipboard.writeText(content);
      setCopied(true);
      toast({
        description: "Cover letter copied to clipboard!",
        duration: 3000,
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadAsTxt = () => {
    if (content) {
      const element = document.createElement("a");
      const file = new Blob([content], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${name.trim()}_${company.trim()}_Cover_Letter.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      toast({
        description: "Cover letter downloaded!",
        duration: 3000,
      });
    }
  };

  const renderParagraphsWithTypingEffect = () => {
    let charCount = 0;
    return paragraphs.map((paragraph, index) => {
      const paragraphStart = charCount;
      charCount += paragraph.length;
      
      const charsToShow = Math.max(0, Math.min(paragraph.length, displayedChars - paragraphStart));
      const visibleText = paragraph.substring(0, charsToShow);
      
      return (
        <p key={index} className="mb-4 last:mb-0">
          {visibleText}
        </p>
      );
    });
  };

  return (
    <Card className="bg-white/80 backdrop-blur border border-border p-6 rounded-xl shadow-sm h-full flex flex-col animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold font-heading">Your Cover Letter</h3>
        <div className="flex space-x-2">
          <Button
            onClick={copyToClipboard}
            variant="outline"
            size="sm"
            disabled={!content || isGenerating}
            className="border-coral hover:bg-coral-light hover:text-coral-dark transition-colors"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button
            onClick={downloadAsTxt}
            variant="outline"
            size="sm"
            disabled={!content || isGenerating}
            className="border-mint hover:bg-mint-light hover:text-mint-dark transition-colors"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div 
        ref={contentRef}
        className="bg-gray-50 rounded-lg p-6 flex-grow overflow-auto no-scrollbar text-sm leading-relaxed relative"
      >
        {!content && !isGenerating && (
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <img 
              src="/lovable-uploads/013f7c6f-6491-4d55-b33a-aa27dc9f209a.png" 
              alt="1 Dollar Cover Letter - First one for free" 
              className="w-[500px] max-w-full"
            />
          </div>
        )}
        
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center h-full space-y-3 py-10">
            <div className="relative">
              <div className="h-8 w-8 rounded-full border-2 border-t-transparent border-teal animate-spin"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 rounded-full border-2 border-t-transparent border-b-transparent border-coral animate-spin"></div>
            </div>
            <p className="text-muted-foreground text-sm animate-pulse-gentle">Crafting your perfect cover letter...</p>
          </div>
        ) : content ? (
          <div className="typing-animation">
            {renderParagraphsWithTypingEffect()}
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            <p>Your generated cover letter will appear here</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default CoverLetterPreview;
