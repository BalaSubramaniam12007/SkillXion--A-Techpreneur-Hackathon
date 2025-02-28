import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);


export async function checkDomainAvailability(brandName) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const domainVariations = [
        `${brandName.toLowerCase().replace(/\s+/g, '')}.com`,
        `${brandName.toLowerCase().replace(/\s+/g, '')}.io`,
        `${brandName.toLowerCase().replace(/\s+/g, '')}.co`,
        `get${brandName.toLowerCase().replace(/\s+/g, '')}.com`,
        `${brandName.toLowerCase().replace(/\s+/g, '')}app.com`
      ];
      
      const prompt = `You are a domain availability expert. For these potential domain names based on the brand "${brandName}":
  
  ${domainVariations.join('\n')}
  
  For each domain:
  1. Evaluate if it's LIKELY to be available (not registered)
  2. Rate how good it is for business use (1-10)
  3. Give ONE brief reason for your rating
  
  Important: This is for ESTIMATION ONLY. You cannot actually check real-time domain registrations.
  
  Format each response EXACTLY as:
  Domain: [domain]
  Available: [Yes/Possibly/Unlikely]
  Rating: [1-10]
  Reason: [One brief sentence - maximum 80 characters]`;
  
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('Raw Domain Check Response:', text);
  
      const domainInfo = text.split('\n\n')
        .filter(block => block.trim())
        .map(block => {
          const lines = block.split('\n');
          let domain = '';
          let available = 'Unlikely';
          let rating = 0;
          let reason = '';
          
          for (const line of lines) {
            if (line.startsWith('Domain:')) {
              domain = line.replace('Domain:', '').trim();
            } else if (line.startsWith('Available:')) {
              available = line.replace('Available:', '').trim();
            } else if (line.startsWith('Rating:')) {
              const ratingText = line.replace('Rating:', '').trim();
              rating = parseInt(ratingText) || 0;
            } else if (line.startsWith('Reason:')) {
              reason = line.replace('Reason:', '').trim();
            }
          }
          
          return { domain, available, rating, reason };
        });
  
      return domainInfo;
    } catch (error) {
      console.error('Error checking domain availability:', error);
      throw new Error('Failed to check domain availability');
    }
  }
  