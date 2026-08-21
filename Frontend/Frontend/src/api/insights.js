import client from './client';

export const getActiveInsights = async () => {
  const response = await client.get('/insights');
  return response.data;
};

export const getUnreadInsightCount = async () => {
  const response = await client.get('/insights/unread');
  return response.data;
};

export const updateInsightStatus = async (id, status) => {
  const response = await client.patch(`/insights/${id}/status`, { status });
  return response.data;
};