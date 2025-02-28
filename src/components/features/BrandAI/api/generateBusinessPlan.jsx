import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function generateBusinessPlan(selectedIdea, selectedBrandName, targetMarket, fundingGoal, businessModel = "Product-Based") {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are a business planning expert. Create a detailed, actionable business plan for:

Business: ${selectedIdea.title}
Description: ${selectedIdea.description}
Brand: ${selectedBrandName.name}
Target Market: ${targetMarket}
Funding Goal: ${fundingGoal}
Business Model: ${businessModel}

Structure it with these headers:

Executive Summary:
[3-4 sentences summarizing the business concept, unique value, and long-term vision]

Target Market:
[3 sentences detailing customer demographics, pain points, and estimated market size]

Revenue Model:
[2-3 sentences explaining how the business will make money, tied to ${businessModel}]

Funding Allocation:
[3 sentences detailing how ${fundingGoal} will be split (e.g., % for product development, marketing), with examples]

Next Steps:
[4 specific, actionable steps to launch, each 1 sentence]

Resources:
[3 real-world resources (e.g., articles, tools) with URLs and 1-sentence descriptions, relevant to ${selectedIdea.title}]

Rules:
- Use plain text, no markdown symbols (e.g., *, **, #) or excessive spacing.
- Keep sections concise (max 150 words each) and consistent in tone.
- Separate sections with a single blank line, no extra labels after the first mention.
- Avoid duplicating section titles or content.
- Ensure resources are practical, verifiable, and tied to ${selectedIdea.title}.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Enhanced parsing logic
    const sections = {
      summary: '',
      targetMarket: '',
      revenueModel: '',
      fundingGoal: '',
      nextSteps: [],
      resources: []
    };

    const contentBlocks = text.split('\n\n');
    let currentSection = null;

    for (const block of contentBlocks) {
      if (block.includes('Executive Summary:')) currentSection = 'summary', sections.summary = block.replace('Executive Summary:', '').trim();
      else if (block.includes('Target Market:')) currentSection = 'targetMarket', sections.targetMarket = block.replace('Target Market:', '').trim();
      else if (block.includes('Revenue Model:')) currentSection = 'revenueModel', sections.revenueModel = block.replace('Revenue Model:', '').trim();
      else if (block.includes('Funding Allocation:')) currentSection = 'fundingGoal', sections.fundingGoal = block.replace('Funding Allocation:', '').trim();
      else if (block.includes('Next Steps:')) {
        currentSection = 'nextSteps';
        sections.nextSteps = block.replace('Next Steps:', '').trim().split('\n').map(step => step.replace(/^-\s*/, '').trim()).filter(step => step);
      } else if (block.includes('Resources:')) {
        currentSection = 'resources';
        sections.resources = block.replace('Resources:', '').trim().split('\n').map(res => res.replace(/^-\s*/, '').trim()).filter(res => res);
      } else if (currentSection && block.trim()) {
        if (currentSection === 'nextSteps' || currentSection === 'resources') {
          const items = block.split('\n').map(item => item.replace(/^-\s*/, '').trim()).filter(item => item);
          sections[currentSection].push(...items);
        } else {
          sections[currentSection] += ' ' + block.trim();
        }
      }
    }

    // Fallbacks for missing sections
    if (!sections.summary) sections.summary = `${selectedBrandName.name} offers ${selectedIdea.title} to solve ${selectedIdea.description.split('.')[0]}.`;
    if (!sections.revenueModel) sections.revenueModel = `Revenue will come from ${businessModel.toLowerCase()} sales targeting ${targetMarket}.`;
    if (sections.resources.length < 3) {
      sections.resources = [
        'https://www.sba.gov/business-guide - Free templates and startup advice from the Small Business Administration.',
        'https://www.score.org - Mentorship and workshops for new entrepreneurs.',
        `https://www.statista.com - Industry data relevant to ${selectedIdea.title}.`
      ];
    }

    return sections;
  } catch (error) {
    console.error('Error generating business plan:', error);
    return {
      summary: `A ${selectedIdea.title} venture branded as ${selectedBrandName.name}.`,
      targetMarket,
      revenueModel: `Sales-driven revenue from ${businessModel.toLowerCase()}.`,
      fundingGoal: `${fundingGoal} will fund startup costs.`,
      nextSteps: ['Build a prototype', 'Launch a website', 'Secure funding', 'Begin marketing'],
      resources: [
        'https://www.sba.gov/business-guide - Startup resources.',
        'https://www.score.org - Free mentoring.',
        'https://www.statista.com - Industry stats.'
      ]
    };
  }
}
