import { generateCashFlowForecast } from '../services/forecast.service.js';
import { explainForecast } from '../ai/services/forecast-explanation.service.js';

export const getForecast = async (req, res) => {
  try {
    let days = parseInt(req.query.days) || 30;
    if (days < 7 || days > 90) days = 30; // Validate range

    const forecast = await generateCashFlowForecast(req.user._id, days);
    const aiExplanation = await explainForecast(forecast);

    res.status(200).json({
      success: true,
      forecast: {
        ...forecast,
        explanation: aiExplanation
      }
    });
  } catch (error) {
    console.error('Forecast API Error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate forecast' });
  }
};