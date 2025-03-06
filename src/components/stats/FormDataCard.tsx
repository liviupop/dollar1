
import React from 'react';
import { Card } from "@/components/ui/card";
import { InfoItem } from './InfoItem';
import { UserStats } from '@/types/stats';

interface FormDataCardProps {
  userStats: UserStats | null;
}

export const FormDataCard = ({ userStats }: FormDataCardProps) => {
  if (!userStats) return null;
  
  return (
    <Card className="p-6 bg-white/90 backdrop-blur shadow-sm h-full">
      <h2 className="text-xl font-semibold mb-4">Form Data</h2>
      
      <div className="space-y-3">
        <InfoItem 
          label="Generation Type" 
          value={userStats.generation_type} 
        />
        <InfoItem 
          label="Referral Code" 
          value={userStats.referral_code} 
        />
        
        {userStats.form_data && (
          <>
            <h3 className="text-lg font-medium mt-4">Input Information</h3>
            {Object.entries(userStats.form_data).map(([key, value]: [string, any]) => (
              <InfoItem 
                key={key} 
                label={key.charAt(0).toUpperCase() + key.slice(1)} 
                value={Array.isArray(value) ? value.join(', ') : value.toString()} 
              />
            ))}
          </>
        )}
        
        <h3 className="text-lg font-medium mt-4">Generated Cover Letter</h3>
        <div className="max-h-80 overflow-y-auto bg-gray-50 p-3 rounded-md text-sm">
          <pre className="whitespace-pre-wrap">{userStats.generated_letter}</pre>
        </div>
      </div>
    </Card>
  );
};
