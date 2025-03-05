export interface GenerateCoverLetterParams {
  name: string;
  jobTitle: string;
  company: string;
  skills: string[];
  experience: string;
  jobDescription: string;
}

// API key for Google Gemini
const GEMINI_API_KEY = "AIzaSyCte7PNcyCQcGm0WyYURe9Bj-XLt-jaytM";

export async function generateCoverLetter(
  params: GenerateCoverLetterParams
): Promise<string> {
  try {
    const { name, jobTitle, company, skills, experience, jobDescription } = params;
    
    const prompt = `
      Write a professional cover letter for ${name} applying for the ${jobTitle} position at ${company}.
      
      Job Description:
      ${jobDescription}
      
      About the candidate:
      - Skills: ${skills.join(', ')}
      - Experience: ${experience}
      
      The cover letter should:
      - Be formal and professional
      - Highlight how the candidate's skills match the job description
      - Show enthusiasm for the role
      - Be around 250-350 words
      - Have a clear structure with introduction, body, and conclusion
      - Not use outdated phrases like "To whom it may concern"
      - Include the word "APPEALING" discretely in the text, as this is required by the job posting
    `;

    // Using the correct v1beta API endpoint with gemini-1.5-pro model
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${errorText}`);
    }

    const data = await response.json();
    
    // Extract the content from Gemini's response format
    if (data && 
        data.candidates && 
        data.candidates[0] && 
        data.candidates[0].content &&
        data.candidates[0].content.parts && 
        data.candidates[0].content.parts[0] &&
        data.candidates[0].content.parts[0].text) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error("Unexpected response format from Gemini API");
    }
  } catch (error) {
    console.error("Error generating cover letter:", error);
    return `Error generating cover letter: ${error instanceof Error ? error.message : String(error)}`;
  }
}

interface JobDetailsResponse {
  skills: string[];
  jobTitle: string;
  company: string;
}

export async function extractSkillsFromJobDescription(
  jobDescription: string
): Promise<JobDetailsResponse> {
  try {
    const prompt = `
      Analyze the following job description and extract:
      1. A list of key skills required for the position (maximum 8 skills)
      2. The exact job title
      3. The company name

      Return ONLY a JSON object with the following structure:
      {
        "skills": ["Skill1", "Skill2", "Skill3"],
        "jobTitle": "Exact Job Title",
        "company": "Company Name"
      }
      
      Keep each skill short (1-3 words maximum) and don't include soft skills like "communication" or "teamwork" unless strongly emphasized.
      Focus on technical and professional skills.
      
      Job Description:
      ${jobDescription}
      
      IMPORTANT: Return ONLY a valid JSON object with the structure shown above. No other text or explanation.
    `;

    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 500,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${errorText}`);
    }

    const data = await response.json();
    
    if (data && 
        data.candidates && 
        data.candidates[0] && 
        data.candidates[0].content &&
        data.candidates[0].content.parts && 
        data.candidates[0].content.parts[0] &&
        data.candidates[0].content.parts[0].text) {
      
      try {
        // Extract JSON from the response
        const responseText = data.candidates[0].content.parts[0].text;
        const jsonMatch = responseText.match(/\{.*\}/s);
        
        if (jsonMatch) {
          const parsedData = JSON.parse(jsonMatch[0]);
          return {
            skills: Array.isArray(parsedData.skills) ? parsedData.skills : [],
            jobTitle: parsedData.jobTitle || "",
            company: parsedData.company || ""
          };
        } else {
          console.error("Could not find JSON object in response:", responseText);
          return { skills: [], jobTitle: "", company: "" };
        }
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        return { skills: [], jobTitle: "", company: "" };
      }
    } else {
      throw new Error("Unexpected response format from Gemini API");
    }
  } catch (error) {
    console.error("Error extracting information:", error);
    return { skills: [], jobTitle: "", company: "" };
  }
}
