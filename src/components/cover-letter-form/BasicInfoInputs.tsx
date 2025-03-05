
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from 'lucide-react';

interface BasicInfoInputsProps {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  jobTitle: string;
  setJobTitle: React.Dispatch<React.SetStateAction<string>>;
  company: string;
  setCompany: React.Dispatch<React.SetStateAction<string>>;
  isExtractingSkills: boolean;
}

const BasicInfoInputs: React.FC<BasicInfoInputsProps> = ({
  name,
  setName,
  jobTitle,
  setJobTitle,
  company,
  setCompany,
  isExtractingSkills
}) => {
  return (
    <>
      <div>
        <Label htmlFor="name" className="text-sm font-medium flex items-center gap-1">
          Your Name <span className="text-red-500">*</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Use "testtest" for testing without payment</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jane Doe"
          className="mt-1.5 bg-white"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="job-title" className="text-sm font-medium flex items-center gap-2">
            Job Title 
            <span className="text-xs text-muted-foreground italic">(Auto-detected from job description)</span>
          </Label>
          <Input
            id="job-title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="Software Engineer"
            className="mt-1.5 bg-white"
            disabled={isExtractingSkills}
          />
        </div>

        <div>
          <Label htmlFor="company" className="text-sm font-medium flex items-center gap-2">
            Company
            <span className="text-xs text-muted-foreground italic">(Auto-detected from job description)</span>
          </Label>
          <Input
            id="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Acme Inc."
            className="mt-1.5 bg-white"
            disabled={isExtractingSkills}
          />
        </div>
      </div>
    </>
  );
};

export default BasicInfoInputs;
