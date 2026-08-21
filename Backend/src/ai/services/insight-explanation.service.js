import getGemini from '../gemini.js'; // Assuming this is your existing wrapper

export const generateInsightExplanation = async (insightData) => {
  const prompt = `
    You are Finora, an AI financial assistant. 
    Write a single, friendly, and professional sentence explaining this financial insight to the user.
    Do NOT invent numbers. Use only the provided data.
    
    Insight Type: ${insightData.type}
    Title: ${insightData.title}
    Amount: ${insightData.amount ? '$' + insightData.amount : 'N/A'}
    Percentage: ${insightData.percentage ? insightData.percentage + '%' : 'N/A'}
    Category: ${insightData.category || 'N/A'}
    Base Description: ${insightData.description}
  `;

  try {
    const gemini = getGemini();
    const response = await gemini.invoke(prompt);
    return response.content.trim();
  } catch (error) {
    console.error("AI Explanation Error:", error);
    return insightData.description; // Fallback to deterministic description
  }
};