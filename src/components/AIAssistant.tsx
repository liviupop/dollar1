
import React from 'react';
import { Card } from "@/components/ui/card";
import { Brain } from 'lucide-react';

const tips = [
  "Tailor your cover letter to highlight skills mentioned in the job description.",
  "Quantify your achievements with numbers when possible.",
  "Keep the tone professional but conversational.",
  "Focus on what you can offer the company, not what they can offer you.",
  "Research the company beforehand to personalize your letter.",
  "Proofread carefully for grammar and spelling errors.",
  "Use industry-specific keywords that may be used in applicant tracking systems.",
  "Address the hiring manager by name if possible.",
  "Keep your cover letter to one page or less.",
  "End with a clear call to action."
];

// Pastel colors for each tip
const pastelColors = [
  { bg: 'bg-[#F2FCE2]', border: 'border-[#D5EAC0]', icon: 'bg-[#D5EAC0]', iconText: 'text-[#6B8A5E]' },  // Soft Green
  { bg: 'bg-[#FEF7CD]', border: 'border-[#F5E79D]', icon: 'bg-[#F5E79D]', iconText: 'text-[#A39641]' },  // Soft Yellow
  { bg: 'bg-[#FEC6A1]', border: 'border-[#EDAB87]', icon: 'bg-[#EDAB87]', iconText: 'text-[#9A5F3C]' },  // Soft Orange
  { bg: 'bg-[#E5DEFF]', border: 'border-[#C5B8EA]', icon: 'bg-[#C5B8EA]', iconText: 'text-[#6F5AA3]' },  // Soft Purple
  { bg: 'bg-[#FFDEE2]', border: 'border-[#F5C6CB]', icon: 'bg-[#F5C6CB]', iconText: 'text-[#A56971]' },  // Soft Pink
  { bg: 'bg-[#FDE1D3]', border: 'border-[#F3C8B4]', icon: 'bg-[#F3C8B4]', iconText: 'text-[#A37864]' },  // Soft Peach
  { bg: 'bg-[#D3E4FD]', border: 'border-[#B3CDED]', icon: 'bg-[#B3CDED]', iconText: 'text-[#5A80B0]' },  // Soft Blue
  { bg: 'bg-[#F1F0FB]', border: 'border-[#D9D7E8]', icon: 'bg-[#D9D7E8]', iconText: 'text-[#7A758F]' },  // Soft Gray
  { bg: 'bg-[#DCF2E3]', border: 'border-[#BEDAC7]', icon: 'bg-[#BEDAC7]', iconText: 'text-[#5E8A71]' },  // Soft Mint
  { bg: 'bg-[#FFE8C2]', border: 'border-[#F3D099]', icon: 'bg-[#F3D099]', iconText: 'text-[#A87E38]' },  // Soft Amber
];

const AIAssistant: React.FC = () => {
  const [currentTip, setCurrentTip] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % tips.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Get current colors based on tip index
  const currentColors = pastelColors[currentTip];

  return (
    <Card 
      className={`${currentColors.bg} ${currentColors.border} p-4 rounded-xl shadow-sm animate-fade-in overflow-hidden transition-colors duration-500`}
    >
      <div className="flex items-start space-x-3 min-h-[90px]">
        <div className={`h-8 w-8 rounded-full ${currentColors.icon} flex items-center justify-center flex-shrink-0 mt-0.5 animate-float`}>
          <Brain className={`h-4 w-4 ${currentColors.iconText}`} />
        </div>
        <div>
          <h4 className={`font-medium ${currentColors.iconText} text-sm mb-1`}>Cover Letter Tip</h4>
          <p className="text-sm text-muted-foreground leading-relaxed relative transition-all duration-500 ease-in-out">
            {tips[currentTip]}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default AIAssistant;
