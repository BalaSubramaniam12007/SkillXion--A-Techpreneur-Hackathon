import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);


export async function generateLogoSuggestions(brandName, colorPreference, stylePreference, customExpectations = '') {
  try {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are a brand identity expert. Create 3 distinct logo concepts for "${brandName}" with these preferences:
  Color scheme: ${colorPreference || 'modern and professional'}
  Style: ${stylePreference || 'minimalist'}
  Additional expectations: ${customExpectations || 'None specified'}
  
  For each concept, provide:
  1. A detailed description of the logo design
  2. The exact color palette (provide hex codes)
  3. Font recommendation
  4. Icon/symbol description
  5. How it represents the brand's identity
  
  Format each concept EXACTLY as:
  Concept: [Concept name]
  Description: [3-4 sentences describing the overall logo - maximum 200 characters]
  Colors: [List 2-4 hex codes, e.g., #FFFFFF, #000000]
  Font: [Specific font recommendation]
  Symbol: [Brief description of icon or symbol - maximum 100 characters]
  Rationale: [Why this works for the brand - maximum 150 characters]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('Raw Logo Suggestions Response:', text);

    const logoSuggestions = text.split('\n\n')
      .filter(block => block.trim())
      .map(block => {
        const lines = block.split('\n');
        let concept = '';
        let description = '';
        let colors = [];
        let font = '';
        let symbol = '';
        let rationale = '';

        for (const line of lines) {
          if (line.startsWith('Concept:')) {
            concept = line.replace('Concept:', '').trim();
          } else if (line.startsWith('Description:')) {
            description = line.replace('Description:', '').trim();
          } else if (line.startsWith('Colors:')) {
            const colorText = line.replace('Colors:', '').trim();
            const hexCodes = colorText.match(/#[0-9A-Fa-f]{6}/g) || [];
            colors = hexCodes.length ? hexCodes : ['#3B82F6', '#10B981'];
          } else if (line.startsWith('Font:')) {
            font = line.replace('Font:', '').trim();
          } else if (line.startsWith('Symbol:')) {
            symbol = line.replace('Symbol:', '').trim();
          } else if (line.startsWith('Rationale:')) {
            rationale = line.replace('Rationale:', '').trim();
          }
        }

        return {
          concept: concept || `${brandName} Logo`,
          description: description || `Modern logo design for ${brandName}`,
          colors,
          font: font || 'Sans-serif',
          symbol: symbol || 'Geometric shape representing the brand',
          rationale: rationale || 'Designed to appeal to the target audience while conveying brand values'
        };
      })
      .slice(0, 3);

    while (logoSuggestions.length < 3) {
      logoSuggestions.push({
        concept: `${brandName} Concept ${logoSuggestions.length + 1}`,
        description: `Alternative logo design for ${brandName}`,
        colors: ['#3B82F6', '#10B981'],
        font: 'Sans-serif',
        symbol: 'Geometric shape representing the brand',
        rationale: 'Designed to appeal to the target audience while conveying brand values'
      });
    }

    return logoSuggestions;
  } catch (error) {
    console.error('Error generating logo suggestions:', error);
    throw new Error('Failed to generate logo suggestions');
  }
}