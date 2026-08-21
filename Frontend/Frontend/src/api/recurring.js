import client from "./client";

export const getRecurringApi = () =>
  client.get("/recurring").then((r) => r.data);

export const addRecurringApi = (payload) =>
  client.post("/recurring", payload).then((r) => r.data);

export const deleteRecurringApi = (id) =>
  client.delete(`/recurring/${id}`).then((r) => r.data);

export const FREQUENCIES = ["Daily", "Weekly", "Monthly", "Yearly"];
