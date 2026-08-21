import client from './client';

export const getCashFlowForecast = async (days = 30) => {
  const response = await client.get(`/forecast?days=${days}`);
  return response.data;
};