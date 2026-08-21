import client from "./client";

export const setBudgetApi = (payload) =>
  client.put("/budget", payload).then((r) => r.data);
