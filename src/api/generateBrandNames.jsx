// generateBrandNames.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function generateBrandNames(selectedIdea, nameStyle) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Generate 5 unique and creative brand names for the following business idea:
Business: ${selectedIdea.title}
Description: ${selectedIdea.description}
Style Preferences: ${nameStyle}

Format each suggestion as:
Name: [The brand name]
Explanation: [Brief explanation of meaning and relevance]

Make names memorable, relevant to the business concept, and matching the requested style.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the response into structured format
    const brandNames = text.split('\n\n')
      .filter(block => block.trim())
      .map(block => {
        const [nameLine, ...explanationLines] = block.split('\n');
        const name = nameLine.replace('Name:', '').trim();
        const explanation = explanationLines.join(' ').replace('Explanation:', '').trim();
        return { name, explanation };
      })
      .slice(0, 5);

    return brandNames;
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Failed to generate brand names');
  }
}