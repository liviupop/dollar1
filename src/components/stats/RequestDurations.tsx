
import React from 'react';
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

export const RequestDurations = () => {
  // Sample data for the chart
  const data = [
    { duration: '< 49', requests: 380 },
    { duration: '< 149', requests: 190 },
    { duration: '< 299', requests: 0 },
    { duration: '< 499', requests: 0 },
    { duration: '< 999', requests: 0 },
    { duration: '1000+', requests: 0 },
  ];

  return (
    <Card className="p-6 bg-gray-900 text-white shadow-sm col-span-1 md:col-span-2">
      <h2 className="text-xl font-semibold mb-4">Request Durations (ms)</h2>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis 
              dataKey="duration" 
              stroke="#9CA3AF" 
              tick={{ fill: '#9CA3AF' }}
              axisLine={{ stroke: '#4B5563' }}
            />
            <YAxis 
              stroke="#9CA3AF" 
              tick={{ fill: '#9CA3AF' }}
              axisLine={{ stroke: '#4B5563' }}
              label={{ value: '# Requests', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
            />
            <Bar 
              dataKey="requests" 
              fill="#3B82F6" 
              radius={[4, 4, 0, 0]} 
              barSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
