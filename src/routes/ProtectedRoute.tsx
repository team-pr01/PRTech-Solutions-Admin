/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCurrentUser } from "../redux/Features/Auth/authSlice";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const user = useSelector(useCurrentUser) as any;
  const location = useLocation();

  // Not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  const currentPath = location.pathname;

  // Admin access
  if (user.role === "admin") {
    // Prevent admin from accessing staff routes
    if (currentPath.startsWith("/leads")) {
      return <Navigate to="/dashboard/admin/home" replace />;
    }

    return <>{children}</>;
  }

  // Staff access
  if (user.role === "staff") {
    // Staff can only access /dashboard/staff/leads
    if (!currentPath.startsWith("/dashboard/staff/leads")) {
      return <Navigate to="/dashboard/staff/leads" replace />;
    }

    return <>{children}</>;
  }

  // Unknown role
  return <Navigate to="/" replace />;
};

export default ProtectedRoute;