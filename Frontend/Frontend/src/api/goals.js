import client from './client.js';

export const getGoals = async () => (await client.get('/goals')).data;
export const createGoal = async (data) => (await client.post('/goals', data)).data;
export const updateGoal = async (id, data) => (await client.put(`/goals/${id}`, data)).data;
export const deleteGoal = async (id) => (await client.delete(`/goals/${id}`)).data;