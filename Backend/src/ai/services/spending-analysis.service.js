import getGemini from "../gemini.js";
import {
  financialAnalysisPrompt,
} from "../prompts/financial.prompt.js";

export const analyzeSpending = async (financialData) => {
  const gemini = getGemini();
  
  const prompt = `
${financialAnalysisPrompt}

USER FINANCIAL DATA:

${JSON.stringify(financialData, null, 2)}
`;

  const response = await gemini.invoke(prompt);

  return response.content;
};