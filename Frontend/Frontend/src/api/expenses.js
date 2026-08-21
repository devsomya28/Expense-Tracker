import client from "./client";

export const getExpensesApi = (params = {}) =>
  client.get("/expenses", { params }).then((r) => r.data);

export const getExpenseApi = (id) =>
  client.get(`/expenses/${id}`).then((r) => r.data);

export const addExpenseApi = (payload) =>
  client.post("/expenses", payload).then((r) => r.data);

export const updateExpenseApi = (id, payload) =>
  client.put(`/expenses/${id}`, payload).then((r) => r.data);

export const deleteExpenseApi = (id) =>
  client.delete(`/expenses/${id}`).then((r) => r.data);

export const EXPENSE_CATEGORIES = [
  "Food",
  "Travel",
  "Shopping",
  "Bills",
  "Entertainment",
  "Other",
];

export const PAYMENT_METHODS = [
  "Cash",
  "UPI",
  "Credit Card",
  "Debit Card",
  "Bank Transfer",
  "Other",
];
