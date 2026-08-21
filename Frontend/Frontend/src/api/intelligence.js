import client from './client'; 

export const getIntelligenceOverview = async () => {
  const response = await client.get('/intelligence/overview');
  return response.data;
};

export const getHealthScore = async () => {
  const response = await client.get('/intelligence/health-score');
  return response.data;
};