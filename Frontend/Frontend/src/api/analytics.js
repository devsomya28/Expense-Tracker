import client from "./client";

export const getAnalyticsApi = () =>
  client.get("/analytics").then((r) => r.data);
