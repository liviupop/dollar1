
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { GenerateCoverLetterParams } from '@/lib/gemini';
import BasicInfoInputs from './cover-letter-form/BasicInfoInputs';
import SkillsInput from './cover-letter-form/SkillsInput';
import DetailedInfoInputs from './cover-letter-form/DetailedInfoInputs';
import SubmitButton from './cover-letter-form/SubmitButton';

interface CoverLetterFormProps {
  onGenerate: (params: GenerateCoverLetterParams) => void;
  isGenerating: boolean;
}

const CoverLetterForm: React.FC<CoverLetterFormProps> = ({ 
  onGenerate,
  isGenerating
}) => {
  // Pre-filled values for testing, except job description and experience
  const [name, setName] = useState('John Doe');
  const [jobTitle, setJobTitle] = useState('Frontend Developer');
  const [company, setCompany] = useState('Tech Solutions Inc.');
  const [skills, setSkills] = useState<string[]>(['React', 'TypeScript', 'CSS', 'HTML']);
  const [experience, setExperience] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [isExtractingSkills, setIsExtractingSkills] = useState(false);

  useEffect(() => {
    // Now validation requires name, job description, AND experience
    const formValid = 
      name.trim() !== '' && 
      jobDescription.trim() !== '' &&
      experience.trim() !== '';
    
    setIsFormValid(formValid);
    console.log("Form validity check:", { 
      name: name.trim() !== '', 
      jobDescription: jobDescription.trim() !== '',
      experience: experience.trim() !== '',
      isFormValid: formValid 
    });
  }, [name, jobTitle, company, skills, experience, jobDescription]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted, isFormValid:", isFormValid, "isGenerating:", isGenerating);
    
    if (isFormValid && !isGenerating) {
      console.log("Submitting form with data:", { name, jobTitle, company, skills, experience, jobDescription });
      onGenerate({
        name,
        jobTitle,
        company,
        skills,
        experience,
        jobDescription
      });
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur border border-border p-6 rounded-xl shadow-sm animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-5">
        <DetailedInfoInputs 
          experience={experience}
          setExperience={setExperience}
          jobDescription={jobDescription}
          setJobDescription={setJobDescription}
          onExtractSkills={(extractedSkills) => setSkills(extractedSkills)}
          onExtractJobDetails={(extractedJobTitle, extractedCompany) => {
            if (extractedJobTitle) setJobTitle(extractedJobTitle);
            if (extractedCompany) setCompany(extractedCompany);
          }}
          isExtractingSkills={isExtractingSkills}
          setIsExtractingSkills={setIsExtractingSkills}
        />

        <BasicInfoInputs 
          name={name}
          setName={setName}
          jobTitle={jobTitle}
          setJobTitle={setJobTitle}
          company={company}
          setCompany={setCompany}
          isExtractingSkills={isExtractingSkills}
        />

        <SkillsInput 
          skills={skills}
          setSkills={setSkills}
          isExtractingSkills={isExtractingSkills}
        />

        <SubmitButton 
          isGenerating={isGenerating || isExtractingSkills} 
          isFormValid={isFormValid} 
        />
      </form>
    </Card>
  );
};

export default CoverLetterForm;
