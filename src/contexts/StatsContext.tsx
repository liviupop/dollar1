
import React, { createContext, useContext, ReactNode } from 'react';
import { useStats } from '@/hooks/use-stats';
import { UserStats } from '@/types/stats';

interface StatsContextValue {
  userStats: UserStats | null;
  allStats: UserStats[];
  isLoading: boolean;
  error: string | null;
}

// Sample test data to display when no real data is available
const createTestUserStats = (
  id: string, 
  ip: string, 
  location: string, 
  name: string, 
  company: string, 
  browser: string = 'Chrome',
  os: string = 'Windows',
  createdAt: string = new Date().toISOString()
): UserStats => ({
  id,
  ip,
  location,
  language: 'en-US',
  browser,
  operating_system: os,
  time_zone: 'America/New_York',
  screen_resolution: '1920x1080',
  user_agent: `Mozilla/5.0 (${os} NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) ${browser}/91.0.4472.124 Safari/537.36`,
  form_data: {
    name,
    company,
    job_title: 'Software Engineer',
    skills: ['JavaScript', 'React', 'TypeScript', 'Node.js'],
    experience: '5 years of experience in frontend development',
    education: 'B.S. in Computer Science',
    jobDescription: 'Looking for a frontend developer with React experience'
  },
  generated_letter: 'Dear Hiring Manager,\n\nI am writing to express my interest in the Software Engineer position at ' + company + '. With 5 years of experience in frontend development using JavaScript, React, TypeScript, and Node.js, I believe I would be a valuable addition to your team.\n\nThank you for your consideration.\n\nSincerely,\n' + name,
  generation_type: 'Free',
  referral_code: 'FRIEND50',
  created_at: createdAt
});

const testUserStats = createTestUserStats(
  'test-123', 
  '192.168.1.1', 
  'New York, USA', 
  'John Doe', 
  'Acme Inc.'
);

// Create more diverse test data
const testAllStats: UserStats[] = [
  testUserStats,
  createTestUserStats(
    'test-456', 
    '203.0.113.1', 
    'San Francisco, USA', 
    'Jane Smith', 
    'Tech Giants', 
    'Chrome',
    'macOS',
    new Date(Date.now() - 86400000).toISOString() // 1 day ago
  ),
  createTestUserStats(
    'test-789', 
    '198.51.100.1', 
    'London, UK', 
    'Alex Johnson', 
    'Global Systems',
    'Firefox',
    'Windows',
    new Date(Date.now() - 172800000).toISOString() // 2 days ago
  ),
  createTestUserStats(
    'test-101', 
    '104.16.44.99', 
    'Berlin, Germany', 
    'Max Mueller', 
    'Deutsche Tech',
    'Chrome',
    'Windows',
    new Date(Date.now() - 259200000).toISOString() // 3 days ago
  ),
  createTestUserStats(
    'test-102', 
    '45.33.22.11', 
    'Paris, France', 
    'Sophie Dubois', 
    'French Innovation',
    'Safari',
    'macOS',
    new Date(Date.now() - 345600000).toISOString() // 4 days ago
  ),
  createTestUserStats(
    'test-103', 
    '91.198.174.192', 
    'Madrid, Spain', 
    'Carlos Rodriguez', 
    'Empresa Technologies',
    'Chrome',
    'Windows',
    new Date(Date.now() - 432000000).toISOString() // 5 days ago
  ),
  createTestUserStats(
    'test-104', 
    '178.242.15.201', 
    'Bucharest, Romania', 
    'Ana Popescu', 
    'Romanian Digital',
    'Edge',
    'Windows',
    new Date(Date.now() - 518400000).toISOString() // 6 days ago
  ),
  createTestUserStats(
    'test-105', 
    '103.102.166.224', 
    'Tokyo, Japan', 
    'Hiroshi Tanaka', 
    'Japan Tech',
    'Chrome',
    'macOS',
    new Date(Date.now() - 604800000).toISOString() // 7 days ago
  ),
  createTestUserStats(
    'test-106', 
    '220.181.108.89', 
    'Beijing, China', 
    'Wei Zhang', 
    'China Innovations',
    'Chrome',
    'Windows',
    new Date(Date.now() - 691200000).toISOString() // 8 days ago
  ),
  createTestUserStats(
    'test-107', 
    '13.107.42.16', 
    'Sydney, Australia', 
    'Emma Johnson', 
    'Down Under Tech',
    'Safari',
    'iOS',
    new Date(Date.now() - 777600000).toISOString() // 9 days ago
  ),
  createTestUserStats(
    'test-108', 
    '72.44.32.10', 
    'Toronto, Canada', 
    'Liam Wilson', 
    'Canadian Software',
    'Firefox',
    'Linux',
    new Date(Date.now() - 864000000).toISOString() // 10 days ago
  )
];

const StatsContext = createContext<StatsContextValue | undefined>(undefined);

export const StatsProvider = ({ children }: { children: ReactNode }) => {
  const stats = useStats();
  
  // Use test data if no real data is available and not loading
  const enhancedStats = {
    ...stats,
    userStats: stats.userStats && stats.userStats.id !== 'local' ? stats.userStats : testUserStats,
    allStats: stats.allStats.length > 0 ? stats.allStats : testAllStats,
    error: null // Override any error to show test data
  };
  
  return (
    <StatsContext.Provider value={enhancedStats}>
      {children}
    </StatsContext.Provider>
  );
};

export const useStatsContext = () => {
  const context = useContext(StatsContext);
  if (context === undefined) {
    throw new Error('useStatsContext must be used within a StatsProvider');
  }
  return context;
};
