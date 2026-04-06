import React from "react";
import { FiUsers, FiBriefcase, FiTrendingUp } from "react-icons/fi";
import { LuLayoutDashboard, LuFolderKanban } from "react-icons/lu";
import { FiUserPlus } from "react-icons/fi";

export interface DashboardLink {
  label: string;
  path: string;
  icon: React.ReactNode;
}

export const adminDashboardLinks: DashboardLink[] = [
  {
    label: "Dashboard",
    path: "/dashboard/admin/home",
    icon: <LuLayoutDashboard />,
  },
  {
    label: "Clients",
    path: "/dashboard/admin/clients",
    icon: <FiUsers />,
  },
  {
    label: "Projects",
    path: "/dashboard/admin/projects",
    icon: <LuFolderKanban />,
  },
  {
    label: "Accounts",
    path: "/dashboard/admin/accounts",
    icon: <FiBriefcase />,
  },
  {
    label: "Staffs",
    path: "/dashboard/admin/staffs",
    icon: <FiUserPlus />,
  },
  {
    label: "Leads",
    path: "/dashboard/admin/leads",
    icon: <FiTrendingUp />,
  },
];

export const staffDashboardLinks: DashboardLink[] = [
  {
    label: "Leads",
    path: "/dashboard/staff/leads",
    icon: <FiTrendingUp />,
  },
];