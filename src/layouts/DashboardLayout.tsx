import { Outlet } from "react-router-dom";
import DashboardHeader from "../components/Dashboard/DashboardHeader/DashboardHeader";
import Sidebar from './../components/Dashboard/Sidebar/Sidebar';

const DashboardLayout = () => {
  return (
    <div className="flex w-full h-screen bg-[#F2F5FC] overflow-x-hidden">
      <Sidebar />

      <div className="flex flex-col w-full min-w-0">
        <DashboardHeader />

        <div className={`flex-1 overflow-y-auto overflow-x-hidden p-5`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
