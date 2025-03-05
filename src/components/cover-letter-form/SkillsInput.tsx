
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, X, Loader2 } from 'lucide-react';

interface SkillsInputProps {
  skills: string[];
  setSkills: React.Dispatch<React.SetStateAction<string[]>>;
  isExtractingSkills?: boolean;
}

const SkillsInput: React.FC<SkillsInputProps> = ({ skills, setSkills, isExtractingSkills = false }) => {
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <Label htmlFor="skills" className="text-sm font-medium">
          Key Skills
        </Label>
        {isExtractingSkills && (
          <div className="flex items-center text-xs text-muted-foreground">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            Extracting skills...
          </div>
        )}
      </div>
      <div className="flex mt-1.5">
        <Input
          id="skills"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a skill (press Enter)"
          className="bg-white rounded-r-none"
          disabled={isExtractingSkills}
        />
        <Button 
          type="button" 
          onClick={addSkill}
          variant="secondary"
          className="rounded-l-none bg-lavender hover:bg-lavender-dark"
          disabled={isExtractingSkills}
        >
          <Plus size={18} />
        </Button>
      </div>
      
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {skills.map((skill) => (
            <div 
              key={skill}
              className="bg-lavender-light text-lavender-dark text-sm px-3 py-1 rounded-full flex items-center"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="ml-2 text-lavender-dark hover:text-lavender"
                disabled={isExtractingSkills}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
      {skills.length === 0 && !isExtractingSkills && (
        <p className="text-xs text-muted-foreground mt-2">Add skills or extract them from the job description</p>
      )}
    </div>
  );
};

export default SkillsInput;
