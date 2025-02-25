import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function generateBusinessPlan(selectedIdea, selectedBrandName, targetMarket, fundingGoal) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Generate a concise business plan for the following business idea and brand:

Business Idea: ${selectedIdea.title}
Description: ${selectedIdea.description}
Brand Name: ${selectedBrandName.name}
Target Market: ${targetMarket}
Funding Goal: ${fundingGoal}

Provide the business plan in this structured format:
- Executive Summary: [A brief overview of the business, its purpose, and goals]
- Target Market: [Description of the target audience and their needs]
- Funding Goal: [Explanation of the funding amount and its intended use]
- Next Steps: [3-5 actionable steps to launch the business]

Keep the content clear, actionable, and tailored to the provided details.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('Raw Business Plan Response:', text); // Debug: Log raw response

    const sections = text.split('\n\n').reduce((acc, block) => {
      const [header, ...content] = block.split('\n');
      if (!header || !content.length) return acc;
      const key = header.replace(/[-:]/g, '').trim().toLowerCase().replace(/\s+/g, '_');
      acc[key] = content.join(' ').trim();
      return acc;
    }, {});

    const plan = {
      summary: sections.executive_summary || 'A concise overview of your business.',
      targetMarket: sections.target_market || targetMarket,
      fundingGoal: sections.funding_goal || fundingGoal,
      nextSteps: sections.next_steps || 'Define your next steps to launch.'
    };

    if (!Object.values(plan).some(value => value)) {
      throw new Error('No valid business plan sections generated');
    }

    return plan;
  } catch (error) {
    console.error('Error generating business plan:', error);
    throw new Error('Failed to generate business plan');
  }
}