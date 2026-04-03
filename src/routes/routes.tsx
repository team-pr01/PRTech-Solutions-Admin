import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Auth/Login/Login";
import AuthLayout from "./../layouts/AuthLayout";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import ErrorComponent from "../components/Reusable/ErrorComponent/ErrorComponent";
import AdminDashboardHome from "../pages/Dashboard/Admin/AdminDashboardHome/AdminDashboardHome";
import NotFound from "../pages/NotFound/NotFound";

export const router = createBrowserRouter([
  // Main layout routes
  {
    path: "/",
    element: <AuthLayout />,
    // errorElement: <ErrorComponent />,
    children: [
      {
        path: "/",
        element: <Login />,
      },
    ],
  },
  // Admin dashboard routes
  {
    path: "dashboard/admin",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorComponent />,
    children: [
      {
        path: "home",
        element: <AdminDashboardHome />,
      },

      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
