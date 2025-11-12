import { Navigate } from "react-router";
import { useAuth } from "../services/authContext";
import type { JSX } from "react";

export function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
