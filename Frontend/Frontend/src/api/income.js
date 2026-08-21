import client from "./client";

export const getIncomeApi = () =>
  client.get("/income").then((r) => r.data);

export const addIncomeApi = (payload) =>
  client.post("/income", payload).then((r) => r.data);

export const INCOME_SOURCES = ["Salary", "Freelancing", "Other"];
