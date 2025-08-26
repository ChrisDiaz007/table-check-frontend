// src/Auth/AuthContext.jsx
import React, { useEffect, useMemo, useState } from "react";
import api, { apiBare } from "../Api/Axios";
import TokenStore from "./TokenStore";
import { AuthContext } from "./Context";

export function AuthProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState(null);
  const [hasToken, setHasToken] = useState(!!TokenStore.getAccessToken()); // <-- NEW

  // On boot, try to hydrate token from refresh cookie
  useEffect(() => {
    (async () => {
      const ok = await TokenStore.hydrateFromRefreshCookie();
      setHasToken(ok); // <-- reflect token presence
      // Optionally load /me here and setUser(...)
      setReady(true);
    })();
  }, []);

  const isAuthenticated = hasToken; // <-- reactive, not from TokenStore directly

  async function login({ email, password }) {
    const { data } = await apiBare.post("/login", {
      user: { email, password },
    });
    const token = data?.access_token;
    const userAttrs = data?.data;
    if (!token) throw new Error("Login succeeded but access_token missing");

    TokenStore.setAccessToken(token);
    setHasToken(true); // <-- tell React we have a token now
    setUser(userAttrs);

    console.log("Logged in. Access Token:", token);
    return userAttrs;
  }

  async function logout() {
    try {
      await api.delete("/logout"); // uses Authorization header
    } catch (e) {
      console.warn(
        "Logout request failed on server; clearing client state anyway.",
        e
      );
    }
    TokenStore.clear();
    setHasToken(false); // <-- force reactive update
    setUser(null);

    console.log("User has been logged out. Access token cleared from memory.");
    console.log("Access Token after logout:", TokenStore.getAccessToken()); // should be null
  }

  const value = useMemo(
    () => ({ ready, user, isAuthenticated, login, logout, setUser }),
    [ready, user, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
