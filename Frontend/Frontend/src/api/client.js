import axios from "axios";

// Relative by default: in dev, Vite's proxy forwards /api to the backend;
// in production, Express serves this build itself so /api is same-origin.
// Only set VITE_API_URL if you deploy the frontend as a separate service.
export const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const client = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // send/receive the httpOnly "token" cookie
  headers: {
    "Content-Type": "application/json",
  },
});

// Normalize error messages coming from the backend's
// { success: false, message } shape.
client.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

export default client;
