import client from "./client";

export const getAccountsApi = () =>
  client.get("/accounts").then((r) => r.data);

export const addAccountApi = (payload) =>
  client.post("/accounts", payload).then((r) => r.data);

export const ACCOUNT_TYPES = [
  "Cash",
  "Bank Account",
  "UPI",
  "Credit Card",
];
