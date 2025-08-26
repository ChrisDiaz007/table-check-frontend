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
      const resp = await apiBare.post(
        "/api/v1/refresh_token",
        null,
        { validateStatus: (s) => s < 500 } // don't throw on 401
      );
      const token = resp?.data?.access_token;
      if (token) {
        accessToken = token;
        console.log("Token refreshed", token);
        return true;
      }
      console.debug("No refresh token cookie found — user not signed in");
      accessToken = null;
      return false;
    } catch (err) {
      console.warn("Error hydrating refresh token", err);
      accessToken = null;
      return false;
    }
  },
};

export default TokenStore;
