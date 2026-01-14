import express from 'express';
import { GoogleGenAI } from "@google/genai";
import { authenticateToken } from '../middleware.js';

const router = express.Router();

const getAI = () => {
    return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

// Helper to wrap async routes
const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/roadmap', authenticateToken, asyncHandler(async (req, res) => {
    const { profile } = req.body;
    const ai = getAI();

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
                type: "OBJECT",
                properties: {
                    goal: { type: "STRING" },
                    durationWeeks: { type: "NUMBER" },
                    steps: {
                        type: "ARRAY",
                        items: {
                            type: "OBJECT",
                            properties: {
                                week: { type: "NUMBER" },
                                topic: { type: "STRING" },
                                description: { type: "STRING" },
                                tasks: {
                                    type: "ARRAY",
                                    items: { type: "STRING" }
                                },
                                resourceType: { type: "STRING", enum: ['Local', 'Online', 'Community'] }
                            },
                            required: ['week', 'topic', 'description', 'tasks', 'resourceType']
                        }
                    }
                },
                required: ['goal', 'durationWeeks', 'steps']
            }
        }
    });

    res.json(JSON.parse(response.text));
}));

router.post('/opportunities', authenticateToken, asyncHandler(async (req, res) => {
    const { profile } = req.body;
    const ai = getAI();

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Suggest 5 simulated local internships or job opportunities for a student in ${profile.location} based on these skills: ${profile.skills.join(", ")}. 
        Focus on NGOs, small businesses, and community projects that are relevant to their interests: ${profile.interests.join(", ")}.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "ARRAY",
                items: {
                    type: "OBJECT",
                    properties: {
                        id: { type: "STRING" },
                        title: { type: "STRING" },
                        company: { type: "STRING" },
                        type: { type: "STRING", enum: ['Internship', 'NGO', 'Small Business', 'Freelance'] },
                        location: { type: "STRING" },
                        matchScore: { type: "NUMBER" },
                        description: { type: "STRING" }
                    },
                    required: ['id', 'title', 'company', 'type', 'location', 'matchScore', 'description']
                }
            }
        }
    });

    res.json(JSON.parse(response.text));
}));

router.post('/mentor-advice', authenticateToken, asyncHandler(async (req, res) => {
    const { profile, mentorName, mentorRole, question } = req.body;
    const ai = getAI();

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

    res.json({ text: response.text });
}));

router.post('/mentors', authenticateToken, asyncHandler(async (req, res) => {
    const { profile } = req.body;
    const ai = getAI();

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Suggest 4 local mentor personas for a student in ${profile.location} with interests in ${profile.interests.join(", ")}. 
        Give them realistic names and roles that would exist in a Tier-2/3 city context (e.g., small business owner, NGO leader, government employee, remote freelancer).`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "ARRAY",
                items: {
                    type: "OBJECT",
                    properties: {
                        name: { type: "STRING" },
                        role: { type: "STRING" },
                        description: { type: "STRING" },
                        specialty: { type: "STRING" }
                    },
                    required: ['name', 'role', 'description', 'specialty']
                }
            }
        }
    });

    res.json(JSON.parse(response.text));
}));

export default router;
