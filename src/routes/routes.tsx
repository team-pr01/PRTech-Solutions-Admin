import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Auth/Login/Login";
import AuthLayout from "./../layouts/AuthLayout";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import ErrorComponent from "../components/Reusable/ErrorComponent/ErrorComponent";
import AdminDashboardHome from "../pages/Dashboard/Admin/AdminDashboardHome/AdminDashboardHome";
import NotFound from "../pages/NotFound/NotFound";
import Clients from "../pages/Dashboard/Admin/Clients/Clients";
import ClientDetails from "../pages/Dashboard/Admin/Clients/ClientDetails";
import Projects from './../pages/Dashboard/Admin/Projects/Projects';
import ProjectDetails from "../pages/Dashboard/Admin/Projects/ProjectDetails";
import Leads from "../pages/Dashboard/Leads/Leads";
import LeadDetails from "../pages/Dashboard/Leads/LeadDetails";
import Accounts from "../pages/Dashboard/Admin/Accounts/Accounts";
import Staffs from "../pages/Dashboard/Admin/Staffs/Staffs";

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
        path: "clients",
        element: <Clients />,
      },
      {
        path: "client/:id",
        element: <ClientDetails />,
      },
      {
        path: "projects",
        element: <Projects />,
      },
      {
        path: "project/:id",
        element: <ProjectDetails />,
      },
      {
        path: "leads",
        element: <Leads />,
      },
      {
        path: "lead/:id",
        element: <LeadDetails />,
      },
      {
        path: "accounts",
        element: <Accounts />,
      },
      {
        path: "staffs",
        element: <Staffs />,
      },

      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
