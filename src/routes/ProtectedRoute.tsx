import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCurrentUser } from "../redux/Features/Auth/authSlice";
import type { TLoggedInUser } from "../types/loggedinUser.types";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const user = useSelector(useCurrentUser) as TLoggedInUser | null;
  const location = useLocation();

  // Redirect unauthenticated users trying to access dashboard
  if (!user && location.pathname.startsWith("/dashboard")) {
    return <Navigate to="/signin" replace />;
  }

  // Role-based access map
  const roleAccess: Record<string, string> = {
    tutor: "/dashboard/tutor",
    guardian: "/dashboard/guardian",
    admin: "/dashboard/admin",
    staff: "/dashboard/staff",
  };

  if (user) {
    const allowedBase = roleAccess[user.role];
    const currentPath = location.pathname;

    // Prevent user from entering another role’s dashboard
    if (
      currentPath.startsWith("/dashboard") &&
      allowedBase &&
      !currentPath.startsWith(allowedBase)
    ) {
      // Redirect to their own dashboard home
      return <Navigate to={`${allowedBase}/home`} replace />;
    }
  }

  // If authorized, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
