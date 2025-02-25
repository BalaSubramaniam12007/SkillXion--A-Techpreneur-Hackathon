// generateIdeas.jsx
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function generateIdeas(skills, interest) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `Generate 5 creative business ideas based on these skills: ${skills.join(', ')} and interest: ${interest}. Format each as:
  Title: [Idea title]
  Description: [Brief description]`;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return text.split('\n\n').map(block => {
    const [titleLine, descLine] = block.split('\n');
    return { title: titleLine.replace('Title:', '').trim(), description: descLine.replace('Description:', '').trim() };
  });
}