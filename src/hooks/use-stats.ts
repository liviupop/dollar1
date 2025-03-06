
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserStats } from '@/types/stats';
import { useToast } from '@/components/ui/use-toast';
import { hasFreeGeneration } from '@/lib/stripe';

export const useStats = () => {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [allStats, setAllStats] = useState<UserStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch stats from Supabase
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        
        // Fetch current user IP
        const ipResponse = await fetch('https://ipapi.co/json/');
        const ipData = await ipResponse.json();
        const currentUserIp = ipData.ip;
        
        // Get all stats
        const { data, error } = await supabase
          .from('user_stats')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          setAllStats(data);
          
          // Find the most recent stats for the current IP
          const currentUserStats = data.find(stat => stat.ip === currentUserIp);
          if (currentUserStats) {
            setUserStats(currentUserStats);
          } else {
            // If no stats found for current IP, use browser info as fallback
            const browserInfo = {
              language: navigator.language || 'unknown',
              browser: getBrowserNameFromUserAgent(),
              operating_system: getOSNameFromUserAgent(),
              time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              screen_resolution: `${window.screen.width}x${window.screen.height}`,
              user_agent: navigator.userAgent
            };
            setUserStats({
              id: 'local',
              ip: currentUserIp || 'Not available',
              location: 'Not found in database',
              ...browserInfo,
              form_data: null,
              generated_letter: 'No letter generated',
              generation_type: hasFreeGeneration() ? 'Free available' : 'Free used',
              referral_code: localStorage.getItem('referralCode') || 'No referral code',
              created_at: new Date().toISOString()
            });
          }
        } else {
          // No stats in the database
          setError('No statistics available yet');
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        setError('Failed to load statistics');
        toast({
          title: 'Error',
          description: 'Failed to load statistics',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  return { userStats, allStats, isLoading, error };
};

// Helper functions to parse user agent
export const getBrowserNameFromUserAgent = () => {
  const ua = navigator.userAgent;
  let browser = "Unknown";
  if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
  else if (ua.includes('Edge')) browser = 'Edge';
  else if (ua.includes('MSIE') || ua.includes('Trident/')) browser = 'Internet Explorer';
  return browser;
};

export const getOSNameFromUserAgent = () => {
  const ua = navigator.userAgent;
  let os = "Unknown";
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
  return os;
};
