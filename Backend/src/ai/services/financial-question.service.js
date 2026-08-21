import getGemini from '../gemini.js';
import { buildQuestionPrompt } from '../prompts/financial-question.prompt.js';
import { getFinancialIntelligence } from '../../services/financial-intelligence.service.js';
import { calculateFinancialHealthScore } from '../../services/health-score.service.js';
import { generateCashFlowForecast } from '../../services/forecast.service.js';

export const answerFinancialQuestion = async (userId, question) => {
  try {
    // 1. Gather deterministic tools/data
    const intelligence = await getFinancialIntelligence(userId);
    const health = calculateFinancialHealthScore(intelligence);
    const forecast = await generateCashFlowForecast(userId, 30);

    // 2. Build a comprehensive context block
    let context = `
      CURRENT DATE: ${new Date().toISOString()}
      --- HEALTH SCORE ---
      Score: ${health.score}/100 (${health.status})
      
      --- INTELLIGENCE ---
      Income: $${intelligence.income.current}
      Expenses: $${intelligence.expenses.current}
      Savings: $${intelligence.savings.amount} (${intelligence.savings.rate}%)
      Budget: $${intelligence.budget.utilized} used of $${intelligence.budget.total}
      Category Totals: ${JSON.stringify(intelligence.categories.totals)}
      
      --- 30-DAY FORECAST ---
      Current Balance: $${forecast.currentBalance}
      Projected Month-End Balance: $${forecast.projectedMonthEndBalance}
      Forecast Status: ${forecast.status}
    `;

    // 3. Prompt Gemini
    const prompt = buildQuestionPrompt(context, question);
    const gemini = getGemini();
    const response = await gemini.invoke(prompt);
    const rawResponse = response.content;

    // 4. Parse the structured JSON safely
    let parsedResponse;
    try {
      const cleanJson = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedResponse = JSON.parse(cleanJson);
    } catch (e) {
      console.error("Failed to parse Copilot JSON:", rawResponse);
      // Fallback to backward compatibility if AI hallucinates formatting
      parsedResponse = {
        answer: rawResponse,
        type: "GENERAL",
        facts: [],
        calculations: [],
        recommendations: [],
        actions: []
      };
    }

    return parsedResponse;
  } catch (error) {
    console.error('Financial Question Service Error:', error);
    throw new Error('Failed to generate answer.');
  }
};