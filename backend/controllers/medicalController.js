import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { medicalInstructions } from '../config/MedisinAi_System_Instructions.js';

dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Add validation for API key
if (!process.env.GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is missing in environment');
  throw new Error('Server configuration error');
}

const systemInstruction = `
You are ${medicalInstructions.identity.name}. Strictly follow these rules:

${medicalInstructions.responseRules}

Sample Interactions:
${medicalInstructions.sampleInteractions.map(([q,a]) => `Q: ${q}\nA: ${a}`).join('\n')}
`;

const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-pro-latest",
    systemInstruction
});

export const medicalQuery = async (req, res) => {
    try {
        const { prompt } = req.body;
        
        if (!prompt?.trim()) {
            return res.status(400).json({ 
                success: false,
                message: "Please ask a health-related question" 
            });
        }

        // Generate response with integrated validation
        const result = await model.generateContent(`
            User Query: "${prompt}"
            
            Your Task:
            1. If medical/health-related: Provide helpful information
            2. If greeting/self-questions: Answer friendly
            3. If unrelated: Politely redirect to health topics
            `);
            
            const response = await result.response;
            const responseText = response.text();
    
            res.json({
                success: true,
                response: responseText
            });
    
        } catch (error) {
            console.error("Medical API Error:", error);
            res.status(500).json({
                success: false,
                message: "I'm having trouble answering that. Please try a health-related question."
            });
        }
    };
