import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function generateIdeas(skills, interest) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are a business idea generation expert. Create exactly 5 innovative business ideas that match these skills: ${skills.join(', ')} and this interest: ${interest}.

For each idea, follow this EXACT format with no deviations:
Title: [Clear, concise business name]
Description: [2-3 sentence description explaining the core concept, target audience, and unique value proposition]

Make each idea distinct and practical. DO NOT include any additional text, numbering, or formatting.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Raw API Response:', text);

    const ideas = text.split('\n\n')
      .filter(block => block.trim())
      .map(block => {
        const lines = block.split('\n');
        let title = '';
        let description = '';
        
        for (const line of lines) {
          if (line.startsWith('Title:')) {
            title = line.replace('Title:', '').trim();
          } else if (line.startsWith('Description:')) {
            description = line.replace('Description:', '').trim();
          }
        }
        
        return { 
          title: title || 'Untitled Idea',
          description: description || 'No description provided'
        };
      })
      .slice(0, 5);

    console.log('Parsed Ideas:', ideas);
    
    // Ensure we have exactly 5 ideas
    while (ideas.length < 5) {
      ideas.push({
        title: `Idea ${ideas.length + 1}`,
        description: 'Additional opportunity based on your skills and interests.'
      });
    }

    return ideas;
  } catch (error) {
    console.error('Error in generateIdeas:', error);
    throw new Error('Failed to generate ideas');
  }
}