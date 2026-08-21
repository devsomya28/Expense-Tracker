import client from "./client";

export const registerApi = (payload) =>
  client.post("/auth/register", payload).then((r) => r.data);

export const loginApi = (payload) =>
  client.post("/auth/login", payload).then((r) => r.data);

export const getMeApi = () =>
  client.get("/auth/me").then((r) => r.data);

// The auth cookie is httpOnly (set by the backend), so it can only be
// cleared server-side via this endpoint - not via document.cookie.
export const logoutApi = () =>
  client.post("/auth/logout").then((r) => r.data);
