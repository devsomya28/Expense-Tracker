import getGemini from '../gemini.js'; // Existing integration

export const explainForecast = async (forecast) => {
  const prompt = `
    You are Finora, an AI financial assistant. Provide a concise, 1-2 sentence explanation of the user's cash-flow forecast.
    DO NOT calculate new numbers. Rely exactly on the data provided below. Ground your advice in reality.

    Data:
    - Current Balance: $${forecast.currentBalance}
    - Projected 30-Day Month-End Balance: $${forecast.projectedMonthEndBalance}
    - Risk Status: ${forecast.status}
    - Confidence in this projection: ${forecast.confidence}
    - Projected Variable Expenses: $${forecast.projectedVariableExpenses}
    - Projected Recurring Expenses: $${forecast.projectedRecurringExpenses}
    - Projected Incoming Cash: $${forecast.projectedIncome}

    Example: "Based on your recent spending rate, you are projected to finish the month with $2,400. Be cautious of upcoming recurring expenses."
  `;

  try {
    const gemini = getGemini();
    const response = await gemini.invoke(prompt);
    return response.content.trim();
  } catch (error) {
    console.error("Forecast Explanation Error:", error);
    return "Your projected month-end balance is calculated based on current daily spending and upcoming recurring bills.";
  }
};