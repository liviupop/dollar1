
import React, { useEffect, useRef } from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { extractSkillsFromJobDescription } from '@/lib/gemini';
import { toast } from '@/components/ui/sonner';
import { Loader2 } from 'lucide-react';

interface DetailedInfoInputsProps {
  experience: string;
  setExperience: React.Dispatch<React.SetStateAction<string>>;
  jobDescription: string;
  setJobDescription: React.Dispatch<React.SetStateAction<string>>;
  onExtractSkills: (skills: string[]) => void;
  onExtractJobDetails: (jobTitle: string, company: string) => void;
  isExtractingSkills: boolean;
  setIsExtractingSkills: React.Dispatch<React.SetStateAction<boolean>>;
}

const DetailedInfoInputs: React.FC<DetailedInfoInputsProps> = ({
  experience,
  setExperience,
  jobDescription,
  setJobDescription,
  onExtractSkills,
  onExtractJobDetails,
  isExtractingSkills,
  setIsExtractingSkills
}) => {
  const extractTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevJobDescriptionRef = useRef<string>(jobDescription);

  const extractInformation = async (text: string) => {
    if (!text.trim() || text.trim().length < 50) {
      return; // Don't attempt extraction on very short texts
    }

    setIsExtractingSkills(true);
    try {
      const { skills, jobTitle, company } = await extractSkillsFromJobDescription(text);
      
      if (skills.length > 0) {
        onExtractSkills(skills);
        toast.success(`Extracted ${skills.length} skills from job description`);
      }
      
      if (jobTitle || company) {
        onExtractJobDetails(jobTitle, company);
        toast.success(`Extracted job details: ${jobTitle} at ${company}`);
      }
    } catch (error) {
      console.error("Error extracting information:", error);
      toast.error("Failed to extract information from job description");
    } finally {
      setIsExtractingSkills(false);
    }
  };

  useEffect(() => {
    // Only run extraction if job description has meaningful changes
    const currentDescription = jobDescription.trim();
    const previousDescription = prevJobDescriptionRef.current.trim();
    
    if (currentDescription && 
        currentDescription.length > 100 && 
        currentDescription !== previousDescription) {
      
      // Clear any pending timeout
      if (extractTimeoutRef.current) {
        clearTimeout(extractTimeoutRef.current);
      }
      
      // Set a new timeout to wait for user to finish pasting/typing
      extractTimeoutRef.current = setTimeout(() => {
        extractInformation(currentDescription);
      }, 1500); // Wait 1.5 seconds after typing stops
    }
    
    prevJobDescriptionRef.current = jobDescription;
    
    // Cleanup timeout on unmount
    return () => {
      if (extractTimeoutRef.current) {
        clearTimeout(extractTimeoutRef.current);
      }
    };
  }, [jobDescription]);

  return (
    <>
      <div>
        <Label htmlFor="job-description" className="text-sm font-medium flex items-center gap-2">
          Job Description <span className="text-red-500">*</span>
          {isExtractingSkills && (
            <span className="text-xs text-muted-foreground flex items-center">
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              Extracting information...
            </span>
          )}
        </Label>
        <Textarea
          id="job-description"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here"
          className="mt-1.5 min-h-[160px] bg-white"
          required
        />
      </div>

      <div>
        <Label htmlFor="experience" className="text-sm font-medium">
          Paste Your CV / Relevant Experience <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="experience"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          placeholder="Paste your CV or relevant experience here"
          className="mt-1.5 min-h-[80px] bg-white"
          required
        />
      </div>
    </>
  );
};

export default DetailedInfoInputs;
