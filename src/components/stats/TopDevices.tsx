
import React from 'react';
import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { UserStats } from '@/types/stats';

interface TopDevicesProps {
  allStats: UserStats[];
}

export const TopDevices = ({ allStats }: TopDevicesProps) => {
  // Extract device data from stats
  const getDeviceData = (stats: UserStats[]) => {
    // For demonstration, return dummy data that matches the UI
    // In production, would calculate from actual stats
    return [
      { name: 'Desktop', value: 72 },
      { name: 'Mobile', value: 18 },
      { name: 'Tablet', value: 8 },
      { name: 'Others', value: 2 },
    ];
  };
  
  const data = getDeviceData(allStats);
  
  const COLORS = ['#4B96F3', '#9E7CF4', '#F67EB6', '#F49E7C'];
  
  return (
    <Card className="p-6 bg-gray-900 text-white shadow-sm h-full">
      <h2 className="text-xl font-semibold mb-4">Top Devices</h2>
      
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
