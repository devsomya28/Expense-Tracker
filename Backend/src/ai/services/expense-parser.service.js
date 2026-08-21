import getGemini from '../gemini.js';
import { buildExpenseParserPrompt } from '../prompts/expense-parser.prompt.js';

export const parseExpenseText = async (text) => {
  try {
    const currentDate = new Date().toISOString().split('T')[0];
    const prompt = buildExpenseParserPrompt(text, currentDate);

    const gemini = getGemini();
    const response = await gemini.invoke(prompt);
    const rawResponse = response.content;
    const cleanJson = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error('Expense Parser Service Error:', error);
    throw new Error('Failed to parse expense text.');
  }
};