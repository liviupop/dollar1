
import { supabase } from "@/integrations/supabase/client";
import { GenerateCoverLetterParams } from "@/lib/gemini";

/**
 * Saves user statistics and cover letter generation data to Supabase
 */
export const saveUserStats = async (
  params: GenerateCoverLetterParams, 
  generatedText: string, 
  usesFreeGeneration: boolean
) => {
  try {
    // Get browser information
    const language = navigator.language || 'unknown';
    const userAgent = navigator.userAgent;
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const screenResolution = `${window.screen.width}x${window.screen.height}`;
    
    // Get browser and OS information
    const getBrowserInfo = () => {
      const ua = navigator.userAgent;
      let browser = "Unknown";
      if (ua.includes('Chrome')) browser = 'Chrome';
      else if (ua.includes('Firefox')) browser = 'Firefox';
      else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
      else if (ua.includes('Edge')) browser = 'Edge';
      else if (ua.includes('MSIE') || ua.includes('Trident/')) browser = 'Internet Explorer';
      return browser;
    };
    
    const getOSInfo = () => {
      const ua = navigator.userAgent;
      let os = "Unknown";
      if (ua.includes('Windows')) os = 'Windows';
      else if (ua.includes('Mac')) os = 'macOS';
      else if (ua.includes('Linux')) os = 'Linux';
      else if (ua.includes('Android')) os = 'Android';
      else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
      return os;
    };
    
    // Fetch IP information
    const ipResponse = await fetch('https://ipapi.co/json/');
    const ipData = await ipResponse.json();
    
    // Create stats object - convert params to plain object to satisfy Json type
    const statsData = {
      ip: ipData.ip || 'Not available',
      location: `${ipData.city || 'Unknown'}, ${ipData.region || 'Unknown'}, ${ipData.country_name || 'Unknown'}`,
      language: language,
      browser: getBrowserInfo(),
      operating_system: getOSInfo(),
      time_zone: timeZone,
      screen_resolution: screenResolution,
      user_agent: userAgent,
      // Convert GenerateCoverLetterParams to a plain object
      form_data: {
        name: params.name,
        jobTitle: params.jobTitle,
        company: params.company,
        skills: params.skills,
        experience: params.experience,
        jobDescription: params.jobDescription
      },
      generated_letter: generatedText,
      generation_type: usesFreeGeneration ? 'Free' : 'Paid ($1)',
      referral_code: localStorage.getItem('referralCode') || 'No referral code'
    };
    
    // Insert into Supabase
    const { error } = await supabase
      .from('user_stats')
      .insert(statsData);
    
    if (error) {
      console.error('Error saving stats to Supabase:', error);
    } else {
      console.log('Successfully saved stats to Supabase');
    }
  } catch (error) {
    console.error('Error in saveUserStats:', error);
    // Don't show an error to the user - stats collection shouldn't impact user experience
  }
};

/**
 * Stores form data and generated content in local storage for debugging purposes
 */
export const saveToLocalStorage = (
  params: GenerateCoverLetterParams, 
  generatedText?: string
) => {
  try {
    localStorage.setItem('coverLetterFormData', JSON.stringify(params));
    if (generatedText) {
      localStorage.setItem('generatedCoverLetter', generatedText);
    }
  } catch (error) {
    console.error("Error storing data in localStorage:", error);
  }
};
