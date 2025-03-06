
import React from 'react';

interface InfoItemProps {
  label: string;
  value: string;
}

/**
 * Helper component for displaying info items in the stats page
 */
export const InfoItem = ({ label, value }: InfoItemProps) => (
  <div>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="text-sm">{value}</p>
  </div>
);
