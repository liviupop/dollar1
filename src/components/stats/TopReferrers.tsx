
import React from 'react';
import { Card } from "@/components/ui/card";
import { ArrowDownUp } from "lucide-react";
import { UserStats } from '@/types/stats';

interface TopReferrersProps {
  allStats: UserStats[];
}

export const TopReferrers = ({ allStats }: TopReferrersProps) => {
  // Extract referrer data from user agent
  const getReferrerData = () => {
    // For demonstration, return dummy data
    // In production, would extract from stats
    const demoReferrers = [
      { name: 'google.com/', count: 34 },
      { name: 'replit.com/', count: 6 },
      { name: 'binance.com', count: 3 },
      { name: 'www.google.com', count: 1 },
    ];
    
    return demoReferrers;
  };
  
  const referrers = getReferrerData();
  
  return (
    <Card className="p-6 bg-gray-900 text-white shadow-sm h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Top Referrers</h2>
        <button className="text-gray-400 hover:text-white">
          <ArrowDownUp size={18} />
        </button>
      </div>
      
      <div className="space-y-4">
        {referrers.map((referrer, index) => (
          <div key={index} className="flex justify-between border-b border-gray-800 pb-3">
            <span className="text-gray-300">{referrer.name}</span>
            <span className="font-medium">{referrer.count}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};
