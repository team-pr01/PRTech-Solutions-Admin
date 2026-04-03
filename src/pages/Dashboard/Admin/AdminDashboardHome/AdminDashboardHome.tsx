/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import DashboardOverviewCard from "../../../../components/Dashboard/DashboardOverviewCard/DashboardOverviewCard";
import {
  FaUserFriends,
  FaChalkboardTeacher,
  FaBriefcase,
  FaDollarSign,
  FaUsers,
} from "react-icons/fa";
import { useGetAdminStatsQuery } from "../../../../redux/Features/Admin/adminApi";
import { MdVerified } from "react-icons/md";
import LogoLoader from "../../../../components/Reusable/LogoLoader/LogoLoader";
import ErrorComponent from "../../../../components/Reusable/ErrorComponent/ErrorComponent";
import { useSelector } from "react-redux";
import { useCurrentUser } from "../../../../redux/Features/Auth/authSlice";
import { FiUnlock } from "react-icons/fi";

// --- Custom Tooltip ---
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-lg text-sm">
        <p className="font-bold mb-1">{label}</p>
        {payload.map((p: any, index: number) => (
          <p key={index} style={{ color: p.color }}>
            {`${p.name}: ${p.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// --- Chart Card ---
interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children }) => (
  <div className="bg-white py-5 rounded-xl shadow-lg border border-gray-100 min-h-[400px]">
    <h2 className="text-lg font-semibold text-gray-800 mb-4 pl-5">{title}</h2>
    <div className="h-[300px] w-full">{children}</div>
  </div>
);

// --- Main Component ---
const AdminDashboardHome = () => {
  const user = useSelector(useCurrentUser) as any;
  const { data: adminStats, isLoading, isError } = useGetAdminStatsQuery({});

  const tutorColor = "#3B82F6";
  const guardianColor = "#10B981";

  // Job chart colors
  const jobsAreaColor = "#6366F1"; // Jobs posted
  const confirmedColor = "#10B981"; // ✅ Green
  const cancelledColor = "#EF4444"; // ❌ Red

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center font-Nunito">
        <LogoLoader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center font-Nunito">
        <ErrorComponent />
      </div>
    );
  }

  return (
    <div className="font-Nunito flex flex-col gap-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-5 2xl:gap-6">
        <DashboardOverviewCard
          title="Total"
          additionalTitle="Guardians"
          value={adminStats?.data?.totalGuardians || 0}
          textColor="text-neutral-10"
          path={`/dashboard/admin/guardians`}
          icon={<FaUserFriends className="text-white md:text-[#3B82F6]" />}
        />

        <DashboardOverviewCard
          title="Registered"
          additionalTitle="Tutors"
          value={adminStats?.data?.totalTutors || 0}
          textColor="text-neutral-10"
          path={`/dashboard/admin/tutors`}
          icon={
            <FaChalkboardTeacher className="text-white md:text-[#10B981]" />
          }
        />

        <DashboardOverviewCard
          title="All"
          additionalTitle="Jobs"
          value={adminStats?.data?.totalJobs || 0}
          textColor="text-neutral-10"
          path={`/dashboard/admin/all-jobs/all`}
          icon={<FaBriefcase className="text-white md:text-[#F59E0B]" />}
        />

        <DashboardOverviewCard
          title="Total"
          additionalTitle="Leads"
          value={adminStats?.data?.totalLeads || 0}
          textColor="text-neutral-10"
          path={`/dashboard/admin/lead-management`}
          icon={<FaUsers className="text-white md:text-green-500" />}
        />

        <DashboardOverviewCard
          title="Verification"
          additionalTitle="Requests"
          value={adminStats?.data?.totalPendingVerificationRequests || 0}
          textColor="text-neutral-10"
          path={`/dashboard/admin/verification-requests?status=pending`}
          icon={<MdVerified className="text-white md:text-primary-10" />}
        />

        <DashboardOverviewCard
          title="Unlock"
          additionalTitle="Requests"
          value={adminStats?.data?.totalTutorsAppliedToUnlockProfile || 0}
          textColor="text-neutral-10"
          path={`/dashboard/admin/tutors?unlockRequestSent=true`}
          icon={<FiUnlock className="text-white md:text-yellow-600" />}
        />

        {user?.role === "admin" && (
          <DashboardOverviewCard
            title="Total"
            additionalTitle="Payment"
            value={`${adminStats?.data?.totalPayment || 0} BDT`}
            textColor="text-neutral-10"
            path={`/dashboard/admin/payments-management`}
            icon={<FaDollarSign className="text-white md:text-[#8B5CF6]" />}
          />
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Registrations */}
        <ChartCard title="Monthly Registrations">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={adminStats?.data?.monthlyRegData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis width={40} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="Tutor"
                stroke={tutorColor}
                strokeWidth={3}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="Guardian"
                stroke={guardianColor}
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* ✅ Jobs Posted / Confirmed / Cancelled */}
        <ChartCard title="Jobs Status Per Month">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={adminStats?.data?.jobPostData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />

              {/* All Jobs */}
              <Area
                type="monotone"
                dataKey="JobsPosted"
                stroke={jobsAreaColor}
                fill={jobsAreaColor}
                fillOpacity={0.1}
                strokeWidth={3}
                dot={false}
              />

              {/* ✅ Confirmed Jobs */}
              <Area
                type="monotone"
                dataKey="ConfirmedJobs"
                stroke={confirmedColor}
                fill={confirmedColor}
                fillOpacity={0.15}
                strokeWidth={3}
                dot={false}
              />

              {/* ❌ Cancelled Jobs */}
              <Area
                type="monotone"
                dataKey="CancelledJobs"
                stroke={cancelledColor}
                fill={cancelledColor}
                fillOpacity={0.15}
                strokeWidth={3}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

export default AdminDashboardHome;
