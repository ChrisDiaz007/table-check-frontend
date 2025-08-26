// src/Sessions/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../Auth/UseAuth";

export default function ProtectedRoute() {
  const { ready, isAuthenticated } = useAuth();

  if (!ready) {
    return null; // or a spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
