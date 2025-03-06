
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Helmet } from 'react-helmet';
import { StatsProvider } from '@/contexts/StatsContext';
import { StatsContent } from '@/components/stats/StatsContent';
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const Stats = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  const correctPassword = 'a'; // Set the password here

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === correctPassword) {
      setIsAuthenticated(true);
      toast({
        title: "Success",
        description: "Authentication successful",
      });
    } else {
      toast({
        title: "Error",
        description: "Incorrect password",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Helmet>
        <title>Analytics | 1 Dollar Cover Letter</title>
        <meta name="description" content="Web analytics and statistics for your cover letter generation" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Web Analytics</h1>
          <Button onClick={() => window.location.href = '/'} variant="outline" className="border-gray-700 hover:bg-gray-800">
            Back to Home
          </Button>
        </div>

        {isAuthenticated ? (
          <StatsProvider>
            <StatsContent />
          </StatsProvider>
        ) : (
          <div className="max-w-md mx-auto mt-16 p-6 bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-center">Authentication Required</h2>
            <p className="mb-6 text-gray-300 text-center">Please enter the password to access statistics</p>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white w-full"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stats;
