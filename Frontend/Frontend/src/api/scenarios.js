import client from './client.js';

export const simulateScenario = async (changes) => {
  const response = await client.post('/scenarios/simulate', { changes });
  return response.data;
};