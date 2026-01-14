import { StudentProfile, Roadmap, LocalOpportunity } from "../types.ts";
import { api } from "./api";

export const generateRoadmap = async (profile: StudentProfile): Promise<Roadmap> => {
  return api.post('/gemini/roadmap', { profile });
};

export const suggestOpportunities = async (profile: StudentProfile): Promise<LocalOpportunity[]> => {
  return api.post('/gemini/opportunities', { profile });
};

export const getMentorAdvice = async (profile: StudentProfile, mentorName: string, mentorRole: string, question: string) => {
  const data = await api.post('/gemini/mentor-advice', { profile, mentorName, mentorRole, question });
  return data.text;
};

export const suggestMentors = async (profile: StudentProfile) => {
  return api.post('/gemini/mentors', { profile });
};

export const chatWithAI = async (message: string, history: Array<{ role: string, content: string }>, profile?: any) => {
  return api.post('/gemini/chat', { message, history, profile });
};