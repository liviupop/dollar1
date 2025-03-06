
import React from 'react';
import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { UserStats } from '@/types/stats';

interface TopBrowsersProps {
  allStats: UserStats[];
}

export const TopBrowsers = ({ allStats }: TopBrowsersProps) => {
  // Extract browser data from stats
  const getBrowserData = (stats: UserStats[]) => {
    // For demonstration, return dummy data that matches the UI
    // In production, would calculate from actual stats
    return [
      { name: 'Chrome', value: 68 },
      { name: 'Firefox', value: 15 },
      { name: 'Safari', value: 12 },
      { name: 'Edge', value: 3 },
      { name: 'Others', value: 2 },
    ];
  };
  
  const data = getBrowserData(allStats);
  
  const COLORS = ['#4B96F3', '#9E7CF4', '#F67EB6', '#F49E7C', '#7CF49E'];
  
  return (
    <Card className="p-6 bg-gray-900 text-white shadow-sm h-full">
      <h2 className="text-xl font-semibold mb-4">Top Browsers</h2>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={0}
              outerRadius={100}
              paddingAngle={0}
              dataKey="value"
              label={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '6px' }}
              formatter={(value: number) => [`${value}%`, 'Share']}
            />
            <Legend 
              layout="vertical" 
              verticalAlign="middle" 
              align="right"
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
