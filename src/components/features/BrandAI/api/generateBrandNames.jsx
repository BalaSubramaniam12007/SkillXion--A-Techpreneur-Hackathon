import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function generateBrandNames(selectedIdea, nameStyle) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Generate 5 unique and creative brand names for the following business idea:
Business: ${selectedIdea.title}
Description: ${selectedIdea.description}
Style Preferences: ${nameStyle || 'creative'}

Format each suggestion as:
Name: [The brand name]
Explanation: [Brief explanation of meaning and relevance]

Make names memorable, relevant to the business concept, and matching the requested style.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('Raw Brand Names Response:', text); // Debug: Log raw response

    const brandNames = text.split('\n\n')
      .filter(block => block.trim())
      .map(block => {
        const [nameLine, ...explanationLines] = block.split('\n');
        const name = nameLine?.startsWith('Name:') 
          ? nameLine.replace('Name:', '').trim() 
          : 'Unnamed Brand';
        const explanation = explanationLines.some(line => line.startsWith('Explanation:')) 
          ? explanationLines.join(' ').replace('Explanation:', '').trim() 
          : 'No explanation provided.';
        return { name, explanation };
      })
      .slice(0, 5);

    if (brandNames.length === 0) {
      throw new Error('No valid brand names generated');
    }

    return brandNames;
  } catch (error) {
    console.error('Error in generateBrandNames:', error);
    throw new Error('Failed to generate brand names');
  }
}