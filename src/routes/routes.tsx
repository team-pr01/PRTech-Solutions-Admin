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
import AllLeads from "../pages/Dashboard/Admin/AllLeads/AllLeads";
import Queries from "../pages/Dashboard/Admin/Queries/Queries";
import Issues from "../pages/Dashboard/Admin/Issues/Issues";
import IssueDetails from "../pages/Dashboard/Admin/Issues/IssueDetails";
import MyCalendar from "../pages/Dashboard/Admin/MyCalendar/MyCalendar";
import Blogs from "../pages/Dashboard/Blogs/Blogs";
import AddOrEditBlog from "../pages/Dashboard/Blogs/AddOrEditBlog/AddOrEditBlog";

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
        path: "blogs",
        element: <Blogs />,
      },
      {
        // for adding new blog
        path: "blog",
        element: <AddOrEditBlog />,
      },
      {
        // for editing blog
        path: "blog/:slug",
        element: <AddOrEditBlog />,
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
        path: "all-leads",
        element: <AllLeads />,
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
        path: "queries",
        element: <Queries />,
      },
      {
        path: "issues",
        element: <Issues />,
      },
      {
        path: "issue/:id",
        element: <IssueDetails />,
      },
      {
        path: "my-calendar",
        element: <MyCalendar />,
      },

      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  // Staff dashboard routes
  {
    path: "dashboard/staff",
    element: (
        <DashboardLayout />
    ),
    errorElement: <ErrorComponent />,
    children: [
      
      {
        path: "leads",
        element: <Leads />,
      },

      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
