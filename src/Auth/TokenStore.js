// src/Auth/TokenStore.js
import { apiBare } from "../Api/Axios";

let accessToken = null;

const TokenStore = {
  getAccessToken() {
    return accessToken;
  },
  setAccessToken(token) {
    accessToken = token || null;
  },
  clear() {
    accessToken = null;
  },

  // Call this on app boot. If a refresh cookie exists, Rails will issue a new access token.
  // If no cookie or it's expired, this will fail (and we'll remain logged out).
  async hydrateFromRefreshCookie() {
    try {
      const resp = await apiBare.post("/api/v1/refresh_token");
      const token = resp?.data?.access_token;
      if (token) {
        accessToken = token;
        return true;
      }
      return false;
    } catch {
      accessToken = null;
      return false;
    }
  },
};

export default TokenStore;
