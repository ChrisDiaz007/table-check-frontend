// src/Api/axios.js
import axios from "axios";
import TokenStore from "../Auth/TokenStore";

// Base API (used for normal requests)
const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true, // allow Rails to send/receive the HttpOnly cookie
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// A bare client that never adds Authorization header or retry logic
// (used only for /login and /api/v1/refresh_token to avoid loops)
export const apiBare = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// ----- Attach access token on every request -----
api.interceptors.request.use((config) => {
  const token = TokenStore.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ----- Refresh handling (single-flight) -----
let isRefreshing = false;
let pendingQueue = [];

function processQueue(error, newToken) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(newToken);
  });
  pendingQueue = [];
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error?.config;
    // If no response or not a 401, just reject.
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // Don’t try to refresh if we’re already hitting auth endpoints
    const hitAuthEndpoint =
      original?.url?.includes("/login") ||
      original?.url?.includes("/logout") ||
      original?.url?.includes("/api/v1/refresh_token");
    if (hitAuthEndpoint) {
      return Promise.reject(error);
    }

    if (!TokenStore.getAccessToken()) {
      return Promise.reject(error);
    }

    // If a refresh is already in progress, queue this request.
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({
          resolve: (token) => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(api(original));
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      // Ask Rails to rotate the refresh cookie and return a fresh access token
      const resp = await apiBare.post("/api/v1/refresh_token", null, {
        validateStatus: (s) => s < 500,
      });
      const newToken = resp?.data?.access_token;
      if (!newToken) throw new Error("Missing access token on refresh");

      TokenStore.setAccessToken(newToken);
      console.log("Access token refreshed:", newToken);
      processQueue(null, newToken);

      // Retry the original request with the new token
      original.headers.Authorization = `Bearer ${newToken}`;
      return api(original);
    } catch (refreshErr) {
      TokenStore.clear(); // drop access token
      processQueue(refreshErr, null);
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
