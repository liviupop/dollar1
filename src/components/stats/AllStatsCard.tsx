
import React from 'react';
import { Card } from "@/components/ui/card";
import { UserStats } from '@/types/stats';

interface AllStatsCardProps {
  allStats: UserStats[];
  onUserSelect: (user: UserStats) => void;
}

export const AllStatsCard = ({ allStats, onUserSelect }: AllStatsCardProps) => {
  return (
    <Card className="p-6 bg-white/90 backdrop-blur shadow-sm md:col-span-2">
      <h2 className="text-xl font-semibold mb-4">All Generations ({allStats.length})</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">IP</th>
              <th className="px-4 py-2 text-left">Location</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Company</th>
            </tr>
          </thead>
          <tbody>
            {allStats.map((stat) => (
              <tr 
                key={stat.id} 
                className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onUserSelect(stat)}
              >
                <td className="px-4 py-2">{new Date(stat.created_at).toLocaleString()}</td>
                <td className="px-4 py-2">{stat.ip}</td>
                <td className="px-4 py-2">{stat.location}</td>
                <td className="px-4 py-2">{stat.generation_type}</td>
                <td className="px-4 py-2">{stat.form_data?.name || 'N/A'}</td>
                <td className="px-4 py-2">{stat.form_data?.company || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
