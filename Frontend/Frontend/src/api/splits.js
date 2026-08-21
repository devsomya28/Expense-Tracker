import client from "./client";

export const getSplitsApi = () =>
  client.get("/splits").then((r) => r.data);

export const addSplitApi = (payload) =>
  client.post("/splits", payload).then((r) => r.data);
