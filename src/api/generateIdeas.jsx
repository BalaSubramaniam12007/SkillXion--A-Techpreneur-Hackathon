import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function generateIdeas(skills, currentInterest) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Generate 5 unique and innovative business/startup ideas based on the following:
Skills: ${skills.join(', ')}
Current Interest: ${currentInterest}

Format each idea as follows:
Title: [Concise business ideas in two words]
Description: [2-3 sentences explaining the concept into keypoints]

Make each idea practical, scalable, and leveraging the mentioned skills.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the response into structured format
    const ideas = text.split('\n\n')
      .filter(block => block.trim())
      .map(block => {
        const [titleLine, ...descLines] = block.split('\n');
        const title = titleLine.replace('Title:', '').trim();
        const description = descLines.join(' ').replace('Description:', '').trim();
        return { title, description };
      })
      .slice(0, 5);

    return ideas;
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Failed to generate ideas');
  }
}