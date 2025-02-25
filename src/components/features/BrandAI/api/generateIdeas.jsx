import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function generateIdeas(skills, interest) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Generate 5 creative business ideas based on these skills: ${skills.join(', ')} and interest: ${interest}. Format each as:
  Title: [Idea title]
  Description: [Brief description]`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Debug: Log the raw response to inspect its format
    console.log('Raw API Response:', text);

    const ideas = text.split('\n\n')
      .filter(block => block.trim()) // Remove empty blocks
      .map(block => {
        const lines = block.split('\n');
        const titleLine = lines[0] || '';
        const descLine = lines[1] || '';
        
        // Safely extract title and description with fallbacks
        const title = titleLine.startsWith('Title:') ? titleLine.replace('Title:', '').trim() : titleLine.trim() || 'Untitled Idea';
        const description = descLine.startsWith('Description:') ? descLine.replace('Description:', '').trim() : descLine.trim() || 'No description provided';
        
        return { title, description };
      })
      .slice(0, 5); // Ensure we only take up to 5 ideas

    // Debug: Log the parsed ideas
    console.log('Parsed Ideas:', ideas);

    return ideas;
  } catch (error) {
    console.error('Error in generateIdeas:', error);
    throw new Error('Failed to generate ideas');
  }
}