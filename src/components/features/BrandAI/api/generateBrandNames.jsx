import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function generateBrandNames(selectedIdea, nameStyle) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are a brand naming specialist. Create exactly 5 ${nameStyle || 'creative'} brand names for this business:
Business: ${selectedIdea.title}
Description: ${selectedIdea.description}

For each suggestion, use this EXACT format with no deviations:
Name: [Brand name]
Explanation: [Single concise sentence explaining relevance and appeal - maximum 120 characters]

Requirements:
- Each name must be unique, memorable, and directly relevant to the business concept
- Names should be short (1-3 words maximum)
- Explanations must fit within display cards (120 characters maximum)
- DO NOT include any numbering, additional formatting, or extra text
- Ensure names are domain-friendly (likely available as .com)`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Raw Brand Names Response:', text);

    const brandNames = text.split('\n\n')
      .filter(block => block.trim())
      .map(block => {
        // Initialize with default values
        let name = 'Unnamed Brand';
        let explanation = 'No explanation provided.';
        
        // Extract name and explanation more reliably
        const lines = block.split('\n');
        for (const line of lines) {
          if (line.startsWith('Name:')) {
            name = line.replace('Name:', '').trim();
          } else if (line.startsWith('Explanation:')) {
            explanation = line.replace('Explanation:', '').trim();
          }
        }
        
        // Ensure explanation fits card (truncate if needed)
        if (explanation.length > 120) {
          explanation = explanation.substring(0, 117) + '...';
        }
        
        return { name, explanation };
      })
      .slice(0, 5);

    // Ensure we have exactly 5 brand names
    while (brandNames.length < 5) {
      brandNames.push({
        name: `Brand ${brandNames.length + 1}`,
        explanation: 'Distinctive name based on your business concept.'
      });
    }

    return brandNames;
  } catch (error) {
    console.error('Error in generateBrandNames:', error);
    throw new Error('Failed to generate brand names');
  }
}