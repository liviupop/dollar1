
import React from 'react';
import { Card } from "@/components/ui/card";
import { InfoItem } from './InfoItem';
import { UserStats } from '@/types/stats';

interface UserInfoCardProps {
  userStats: UserStats | null;
}

export const UserInfoCard = ({ userStats }: UserInfoCardProps) => {
  if (!userStats) return null;
  
  return (
    <Card className="p-6 bg-white/90 backdrop-blur shadow-sm h-full">
      <h2 className="text-xl font-semibold mb-4">Your Information</h2>
      
      <div className="space-y-3">
        <InfoItem label="IP Address" value={userStats.ip} />
        <InfoItem label="Location" value={userStats.location} />
        <InfoItem label="Browser Language" value={userStats.language} />
        <InfoItem label="Browser" value={userStats.browser} />
        <InfoItem label="Operating System" value={userStats.operating_system} />
        <InfoItem label="Time Zone" value={userStats.time_zone} />
        <InfoItem label="Screen Resolution" value={userStats.screen_resolution} />
        <div>
          <p className="text-sm font-medium text-gray-500">User Agent</p>
          <p className="text-sm break-words">{userStats.user_agent}</p>
        </div>
      </div>
    </Card>
  );
};
