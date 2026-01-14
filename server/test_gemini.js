import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

async function test() {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    try {
        console.log("Fetching available models...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        // We can't list models directly with the helper but we can try to generate content to test
        // Actually we CAN list models with the SDK often, but let's check the docs pattern or just try a lighter test.
        // Wait, the error message itself suggested "Call ListModels". The SDK usually has a way.
        // genAI.getGenerativeModel is for getting a specific model.

        // Let's try to hit the REST API directly for listing models if the SDK method isn't obvious, 
        // OR just try a simple generate with a few variants.

        console.log("Testing gemini-1.5-flash...");
        try {
            const result = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" }).generateContent("Hello");
            console.log("Success with gemini-1.5-flash:", result.response.text());
            return;
        } catch (e) { console.log("Failed gemini-1.5-flash:", e.message); }

        console.log("Testing gemini-pro...");
        try {
            const result = await genAI.getGenerativeModel({ model: "gemini-pro" }).generateContent("Hello");
            console.log("Success with gemini-pro:", result.response.text());
            return;
        } catch (e) { console.log("Failed gemini-pro:", e.message); }

        console.log("Testing gemini-1.0-pro...");
        try {
            const result = await genAI.getGenerativeModel({ model: "gemini-1.0-pro" }).generateContent("Hello");
            console.log("Success with gemini-1.0-pro:", result.response.text());
            return;
        } catch (e) { console.log("Failed gemini-1.0-pro:", e.message); }

    } catch (error) {
        console.error("Error:", error);
    }
}

test();
