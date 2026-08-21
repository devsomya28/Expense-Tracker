import client from './client.js';

export const getSubscriptionData = async () => {
  const response = await client.get('/subscription/me');
  return response.data;
};

export const devUpgradeToPro = async () => {
  const response = await client.post('/subscription/dev/upgrade');
  return response.data;
};