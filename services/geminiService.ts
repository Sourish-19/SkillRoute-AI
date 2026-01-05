
import { GoogleGenAI, Type } from "@google/genai";
import { StudentProfile, Roadmap, LocalOpportunity } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateRoadmap = async (profile: StudentProfile): Promise<Roadmap> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a detailed career roadmap for a student with the following profile:
    Name: ${profile.name}
    Location: ${profile.location} (Tier 2/3 context)
    Current Skills: ${profile.skills.join(", ")}
    Interests: ${profile.interests.join(", ")}
    Internet Access: ${profile.internetAccess}
    Language: ${profile.preferredLanguage}
    
    The roadmap should focus on practical, local-friendly skills that lead to high-growth opportunities even with constraints.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          goal: { type: Type.STRING },
          durationWeeks: { type: Type.NUMBER },
          steps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                week: { type: Type.NUMBER },
                topic: { type: Type.STRING },
                description: { type: Type.STRING },
                tasks: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                resourceType: { type: Type.STRING, enum: ['Local', 'Online', 'Community'] }
              },
              required: ['week', 'topic', 'description', 'tasks', 'resourceType']
            }
          }
        },
        required: ['goal', 'durationWeeks', 'steps']
      }
    }
  });

  return JSON.parse(response.text);
};

export const suggestOpportunities = async (profile: StudentProfile): Promise<LocalOpportunity[]> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Suggest 5 simulated local internships or job opportunities for a student in ${profile.location} based on these skills: ${profile.skills.join(", ")}. 
    Focus on NGOs, small businesses, and community projects that are relevant to their interests: ${profile.interests.join(", ")}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            company: { type: Type.STRING },
            type: { type: Type.STRING, enum: ['Internship', 'NGO', 'Small Business', 'Freelance'] },
            location: { type: Type.STRING },
            matchScore: { type: Type.NUMBER },
            description: { type: Type.STRING }
          },
          required: ['id', 'title', 'company', 'type', 'location', 'matchScore', 'description']
        }
      }
    }
  });

  return JSON.parse(response.text);
};

export const getMentorAdvice = async (profile: StudentProfile, mentorName: string, mentorRole: string, question: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are acting as ${mentorName}, a ${mentorRole} who mentors students in Tier-2 and Tier-3 cities in India.
    A student named ${profile.name} from ${profile.location} is asking you: "${question}".
    
    Student Profile:
    - Skills: ${profile.skills.join(", ")}
    - Interests: ${profile.interests.join(", ")}
    - Language: ${profile.preferredLanguage}
    
    Provide a warm, encouraging, and practical response that takes into account local constraints but encourages high aspirations.`,
  });

  return response.text;
};

export const suggestMentors = async (profile: StudentProfile) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Suggest 4 local mentor personas for a student in ${profile.location} with interests in ${profile.interests.join(", ")}. 
    Give them realistic names and roles that would exist in a Tier-2/3 city context (e.g., small business owner, NGO leader, government employee, remote freelancer).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            role: { type: Type.STRING },
            description: { type: Type.STRING },
            specialty: { type: Type.STRING }
          },
          required: ['name', 'role', 'description', 'specialty']
        }
      }
    }
  });

  return JSON.parse(response.text);
};
