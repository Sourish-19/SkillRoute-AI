import express from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { authenticateToken } from '../middleware.js';

const router = express.Router();

const getAIModel = () => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY is missing");
    }
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    return genAI.getGenerativeModel({ model: "gemini-pro" });
};

// Helper to wrap async routes
const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Mock Data Generator
const getMockData = (type, profile, body = {}) => {
    switch (type) {
        case 'roadmap':
            return {
                goal: `Master ${profile.skills[0] || 'Development'}`,
                durationWeeks: 4,
                steps: [
                    { week: 1, topic: "Foundations", description: "Learn the basics.", tasks: ["Watch crash course", "Build simple demo"], resourceType: "Online" },
                    { week: 2, topic: "Local Application", description: `Apply skills to ${profile.location} context.`, tasks: ["Find local problem", "Draft solution"], resourceType: "Local" },
                    { week: 3, topic: "Building", description: "Create a portfolio project.", tasks: ["Code core features", "Test with friends"], resourceType: "Community" },
                    { week: 4, topic: "Launch", description: "Share your work.", tasks: ["Deploy project", "Share on social media"], resourceType: "Online" }
                ]
            };
        case 'opportunities':
            // ... (keep existing opportunities mock data)
            return [
                {
                    id: "mock1",
                    title: "Website for Local Grocery",
                    company: `${profile.location} Fresh Mart`,
                    type: "Freelance",
                    location: profile.location,
                    matchScore: 95,
                    description: "We need a simple website to list our daily fresh vegetables. Looking for a student who knows basic HTML/CSS.",
                    requirements: ["HTML", "CSS", "Basic Design"],
                    stipend: "₹5,000 / project",
                    duration: "2 Weeks"
                },
                {
                    id: "mock2",
                    title: "Tech Volunteer",
                    company: "City NGO Foundation",
                    type: "NGO",
                    location: profile.location,
                    matchScore: 88,
                    description: "Help us digitize our donor records. Basic Excel and data entry automation needed.",
                    requirements: ["Excel", "Data Entry", "Detail Oriented"],
                    stipend: "Unpaid (Certificate provided)",
                    duration: "1 Month"
                },
                {
                    id: "mock3",
                    title: "Social Media Intern",
                    company: "Heritage Cafe",
                    type: "Internship",
                    location: profile.location,
                    matchScore: 82,
                    description: "Manage our Instagram page and create graphics for upcoming events.",
                    requirements: ["Canva", "Instagram", "Photography"],
                    stipend: "₹3,000 / month",
                    duration: "3 Months"
                }
            ];
        case 'mentors':
            return [
                {
                    name: "Rahul Sharma",
                    role: "Freelance Developer",
                    description: `I've been working remotely from ${profile.location} for 3 years. Happy to guide beginners.`,
                    specialty: "Freelancing"
                },
                {
                    name: "Dr. Anjali Gupta",
                    role: "College Professor",
                    description: "Passionate about connecting students with research opportunities.",
                    specialty: "Academia"
                },
                {
                    name: "Vikram Singh",
                    role: "Small Business Owner",
                    description: "I run a local tech shop and can teach you about hardware sourcing.",
                    specialty: "Entrepreneurship"
                }
            ];
        case 'advice':
            return { text: "That's a great question! In our local market, the most important thing is to build a portfolio. Don't worry about big certifications yet. Just build something small for a neighbor or a local shop. That practical experience is worth gold here." };
        case 'chat':
            const msg = (body.message || "").toLowerCase();
            const name = profile.name || "Student";
            if (msg.includes('hello') || msg.includes('hi')) return { text: `Hello ${name}! I'm in offline mode right now, but I can still help. Ask me about 'jobs', 'mentors', or 'roadmap'.` };
            if (msg.includes('job') || msg.includes('work') || msg.includes('internship')) return { text: "I can help you find local opportunities! Check out the 'Local Opportunities' tab for gigs in your area." };
            if (msg.includes('roadmap') || msg.includes('learn')) return { text: "Want to learn a new skill? Go to the 'Roadmap' tab and I'll generate a personalized study plan for you." };
            if (msg.includes('mentor') || msg.includes('advice')) return { text: "Connecting with locals is key. Visit the 'Mentorship' tab to find experts near you." };
            return { text: "I'm currently experiencing high traffic (Offline Mode). Please try checking the Roadmap or Opportunities tabs directly, or ask me about 'jobs' or 'learning'." };
        default:
            return {};
    }
};

// Helper: Attempt Gemini, fallback to Mock if 429/404/503
const safeGenerate = async (req, res, modelCall, mockType) => {
    try {
        await modelCall();
    } catch (e) {
        if (e.message.includes("429") || e.message.includes("404") || e.message.includes("503") || e.message.includes("Quota")) {
            console.warn(`[Gemini] API Error (${e.message}). Serving Mock Data for ${mockType}.`);
            const mock = getMockData(mockType, req.body.profile || {}, req.body);
            // If the route expects array but mock returns obj (or vice versa), handle it. 
            // Our mock data structure matches the route expectations.
            return res.json(mock);
        }
        console.error("[Gemini] Critical Error:", e);
        res.status(500).json({ error: "Operation failed", details: e.message });
    }
};

// Roadmap Generation
router.post('/roadmap', authenticateToken, (req, res) => {
    safeGenerate(req, res, async () => {
        console.log(`[Gemini] Generating roadmap for ${req.body.profile?.name}`);
        const { profile } = req.body;
        const model = getAIModel();

        const prompt = `
        Generate a detailed career roadmap (JSON format) for a student:
        Name: ${profile.name}
        Location: ${profile.location} (Tier 2/3 context)
        Skills: ${profile.skills.join(", ")}
        Interests: ${profile.interests.join(", ")}
        Language: ${profile.preferredLanguage}
        
        Return ONLY valid JSON with this structure:
        {
            "goal": "string",
            "durationWeeks": number,
            "steps": [
                {
                    "week": number,
                    "topic": "string",
                    "description": "string",
                    "tasks": ["string"],
                    "resourceType": "Local" | "Online" | "Community"
                }
            ]
        }
        `;

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
        });

        const text = result.response.text();
        console.log("[Gemini] Roadmap generated.");
        res.json(JSON.parse(text));
    }, 'roadmap');
});

// Opportunities Generation
router.post('/opportunities', authenticateToken, (req, res) => {
    safeGenerate(req, res, async () => {
        console.log(`[Gemini] Identifying opportunities in ${req.body.profile?.location}`);
        const { profile } = req.body;
        const model = getAIModel();

        const prompt = `
        Act as a local career counselor in ${profile.location}.
        Identify 5 realistic, simulated LOCAL opportunities for a student with these skills: ${profile.skills.join(", ")}.
        
        CRITICAL RULES:
        1. NO generic big tech jobs (Google, Microsoft).
        2. Focus on: Local NGOs, small retail businesses needing websites, local schools needing tech support, or freelance gigs for local shops.
        3. Context: Tier 2/3 city in India. Resources are limited.
        
        Return ONLY valid JSON:
        [
            {
                "id": "string",
                "title": "string",
                "company": "string (Local Business Name)",
                "type": "Internship" | "NGO" | "Small Business" | "Freelance",
                "location": "${profile.location}",
                "matchScore": number (70-98),
                "description": "string (Specific details about what they need)",
                "requirements": ["string", "string"],
                "stipend": "string (e.g. ₹5000/month or Unpaid)",
                "duration": "string (e.g. 2 months)"
            }
        ]
        `;

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
        });

        res.json(JSON.parse(result.response.text()));
    }, 'opportunities');
});

// Mentor Advice
router.post('/mentor-advice', authenticateToken, (req, res) => {
    safeGenerate(req, res, async () => {
        const { profile, mentorName, mentorRole, question } = req.body;
        const model = getAIModel();

        const prompt = `
        Act as ${mentorName}, a ${mentorRole} based in ${profile.location}.
        Your persona: deeply knowledgeable about the local market in ${profile.location} but encouraging.
        Student Name: ${profile.name}
        Question: "${question}"
        
        Give specific, actionable advice relevant to a Tier 2/3 city context. Keep it under 100 words.
        `;

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }]
        });
        res.json({ text: result.response.text() });
    }, 'advice');
});

// Mentor Personas
router.post('/mentors', authenticateToken, (req, res) => {
    safeGenerate(req, res, async () => {
        const { profile } = req.body;
        const model = getAIModel();

        const prompt = `
        Create 4 simulated local mentor personas in ${profile.location} who can help with: ${profile.interests.join(", ")}.
        
        They should sound like real community members (e.g., "Senior Freelancer", "Local College Professor", "NGO Director").
        
        Return ONLY valid JSON:
        [
            {
                "name": "string",
                "role": "string",
                "description": "string (Backstory in ${profile.location})",
                "specialty": "string"
            }
        ]
        `;

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
        });

        res.json(JSON.parse(result.response.text()));
    }, 'mentors');
});

// Chat Assistant
router.post('/chat', authenticateToken, (req, res) => {
    safeGenerate(req, res, async () => {
        const { message, history } = req.body;
        const model = getAIModel();

        // Convert frontend history format to Gemini format if needed
        // Assuming frontend sends [{ role: 'user'|'model', parts: [{ text: '...' }] }]
        // If frontend sends simple { role, content }, map it.
        const chatHistory = history ? history.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        })) : [];

        // Gemini requires history to start with 'user'
        while (chatHistory.length > 0 && chatHistory[0].role === 'model') {
            chatHistory.shift();
        }

        const chat = model.startChat({
            history: chatHistory
        });

        const result = await chat.sendMessage(message);
        const response = result.response.text();

        res.json({ text: response });
    }, 'chat');
});

export default router;
