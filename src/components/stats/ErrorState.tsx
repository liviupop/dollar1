
import React from 'react';

interface ErrorStateProps {
  error: string;
}

export const ErrorState = ({ error }: ErrorStateProps) => (
  <div className="text-center p-8">
    <p className="text-destructive">{error}</p>
  </div>
);
