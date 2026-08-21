import getGemini from "../gemini.js";
import {
  financialQuestionPrompt,
} from "../prompts/financial-question.prompt.js";

export const askFinancialQuestion = async (
  question,
  financialData
) => {
  const gemini = getGemini();

  const prompt = `
${financialQuestionPrompt}

USER QUESTION:
${question}

USER FINANCIAL DATA:
${JSON.stringify(financialData, null, 2)}
`;

  const response = await gemini.invoke(prompt);

  return response.content;
};