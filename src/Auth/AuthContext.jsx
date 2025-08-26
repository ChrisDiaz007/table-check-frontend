// src/Auth/AuthContext.jsx
import React, { useEffect, useMemo, useState } from "react";
import api, { apiBare } from "../Api/Axios";
import TokenStore from "./TokenStore";
import { AuthContext } from "./Context";

const USER_STORAGE_KEY = "app_user"; // 👈 key for localStorage

export function AuthProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState(null);
  const [hasToken, setHasToken] = useState(!!TokenStore.getAccessToken());

  // On boot, hydrate token + user
  useEffect(() => {
    (async () => {
      // Load user from localStorage immediately (non-sensitive info only)
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          localStorage.removeItem(USER_STORAGE_KEY); // corrupted data, clear it
        }
      }

      // Try to hydrate access token from refresh cookie
      const ok = await TokenStore.hydrateFromRefreshCookie();
      setHasToken(ok);

      // Optionally, you could fetch /me here to revalidate user data
      // if (ok) {
      //   const { data } = await api.get("/me");
      //   setUser(data);
      //   localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data));
      // }

      setReady(true);
    })();
  }, []);

  const isAuthenticated = hasToken;

  async function login({ email, password }) {
    const { data } = await apiBare.post("/login", {
      user: { email, password },
    });
    const token = data?.access_token;
    const userAttrs = data?.data;

    if (!token) throw new Error("Login succeeded but access_token missing");

    // Save access token in memory only
    TokenStore.setAccessToken(token);
    setHasToken(true);
    setUser(userAttrs);

    // Persist minimal user info in localStorage
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userAttrs));

    console.log("Logged in. Access Token:", token);
    return userAttrs;
  }

  async function logout() {
    try {
      await api.delete("/logout");
    } catch (e) {
      console.warn(
        "Logout request failed on server; clearing client state anyway.",
        e
      );
    }

    TokenStore.clear();
    setHasToken(false);
    setUser(null);

    // Clear persisted user
    localStorage.removeItem(USER_STORAGE_KEY);

    console.log("User has been logged out. Access token cleared from memory.");
  }

  const value = useMemo(
    () => ({ ready, user, isAuthenticated, login, logout, setUser }),
    [ready, user, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
