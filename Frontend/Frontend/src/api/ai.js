import client from './client.js';

// GET /api/ai/spending-analysis - one-click AI spending analysis (see README)
export const getSpendingAnalysisApi = async () => {
  const response = await client.get('/ai/spending-analysis');
  return response.data;
};

// POST /api/ai/ask - chat-style financial question answering
export const askFinancialQuestionApi = async (question) => {
  const response = await client.post('/ai/ask', { question });
  return response.data;
};

export const parseNaturalLanguageExpense = async (text) => {
  const response = await client.post('/ai/parse-expense', { text });
  return response.data;
};