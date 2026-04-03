/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLocation } from "react-router-dom";
import Table, {
  type TableHead,
} from "../../../../components/Reusable/Table/Table";
import { useGetAllApplicationsQuery } from "../../../../redux/Features/Application/applicationApi";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useCurrentUser } from "../../../../redux/Features/Auth/authSlice";
import type { TLoggedInUser } from "../../../../types/loggedinUser.types";
import { formatDate, formatDateTime } from "../../../../utils/formatDate";
import toast from "react-hot-toast";
import { FiCalendar, FiEye } from "react-icons/fi";
import { statusStyles } from "../../Guardian/Applications/Applications";
import UpdateDemoDate from "../../Shared/UpdateDemoDate/UpdateDemoDate";
import Button from "../../../../components/Reusable/Button/Button";
import UpdateFollowUpStatus from "../../Shared/UpdateFollowUpStatus/UpdateFollowUpStatus";
import { MdHistory } from "react-icons/md";

const AllApplications = () => {
  const pathname = useLocation().pathname;
  const user = useSelector(useCurrentUser) as TLoggedInUser;
  const path =
    user?.role === "admin"
      ? "admin"
      : user?.role === "staff"
        ? "staff"
        : "guardian";
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(50);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [demoDate, setDemoDate] = useState<string>("");
  const [applicationId, setApplicationId] = useState<string>("");
  const [isDemoDateModalOpen, setIsDemoDateModalOpen] =
    useState<boolean>(false);
  const [isUpdateFollowUpModalOpen, setIsUpdateFollowUpModalOpen] =
    useState<boolean>(false);

  const {
    data: applications,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllApplicationsQuery({
    page,
    limit,
    status: statusFilter,
    keyword: searchQuery,
    demoDate,
  });

  useEffect(() => {
    refetch();
  }, [pathname]);

  const applicationTheads: TableHead[] = [
    { key: "name", label: "Applicant Name" },
    // { key: "location", label: "Location" },
    { key: "appliedDate", label: "Applied Date" },
    { key: "shortlistedOn", label: "Shortlisted On" },
    { key: "appointedOn", label: "Appointed On" },
    { key: "confirmedOn", label: "Confirmed On" },
    { key: "rejectedOn", label: "Cancelled On" },
    { key: "status", label: "Status" },
    { key: "jobId", label: "Job Id" },
    { key: "resumeViewedOn", label: "Last Viewed" },
    { key: "demoDate", label: "Demo Date" },
    { key: "followUpStatus", label: "Follow Up Status" },
    { key: "cv", label: "View CV" },
  ];

  const tableData =
    applications?.data?.applications?.map((application: any) => {
      const url = `/dashboard/${path}/application/${application._id}/resume/${application.tutorMongoId}?status=${application.status}&jobId=${application.jobId}`;
      return {
        id: application._id,
        jobId: application.jobId || "N/A",
        name: (
          <div>
            <span className="block font-medium">
              {application.userName}{" "}
              <span className="text-primary-10">
                (Tutor Id : {application.tutorCustomId})
              </span>
            </span>
            <span className="block text-sm text-gray-500">
              {application.userPhoneNumber}
            </span>
          </div>
        ),
        // location: `${application.tutorAddress ? application.tutorAddress : "N/A"}`,
        appliedDate: formatDate(application.createdAt),

        shortlistedOn: application.shortlistedOn
          ? formatDate(application.shortlistedOn)
          : "N/A",
        appointedOn: application.appointedOn
          ? formatDate(application.appointedOn)
          : "N/A",
        confirmedOn: application.confirmedOn
          ? formatDate(application.confirmedOn)
          : "N/A",
        rejectedOn: application.rejectedOn
          ? formatDate(application.rejectedOn)
          : "N/A",
        resumeViewedOn: (
          <span
            className={`capitalize px-3 py-1 rounded-full text-xs font-bold font-Nunito
            ${application?.resumeViewedOn ? "bg-teal-500 text-white" : "bg-teal-50 text-gray-600"}
          `}
          >
            {application?.resumeViewedOn
              ? formatDateTime(application?.resumeViewedOn)
              : "Not Viewed Yet"}
          </span>
        ),
        status: (
          <span
            className={`capitalize px-3 py-1 rounded-full text-xs font-bold font-Nunito
            ${statusStyles[application?.status] || "bg-gray-100 text-gray-600"}
          `}
          >
            {application?.status === "rejected"
              ? "Cancelled"
              : application?.status}
          </span>
        ),
        demoDate: (
          <button
            onClick={() => {
              setApplicationId(application._id);
              setIsDemoDateModalOpen(true);
            }}
            className="text-primary-10 cursor-pointer flex items-center gap-1 hover:underline"
          >
            <FiCalendar className="size-4" />{" "}
            {application?.demoDate ? formatDate(application?.demoDate) : "Set"}
          </button>
        ),
        followUpStatus: (
          <button
            onClick={() => {
              setApplicationId(application._id);
              setIsUpdateFollowUpModalOpen(true);
            }}
            className="text-purple-600 cursor-pointer flex items-center gap-1 hover:underline"
          >
            <MdHistory className="size-4" />{" "}
            {application?.followUpStatus ? application?.followUpStatus : "Set"}
          </button>
        ),
        cv: (
          <a
            href={url}
            onClick={(e) => {
              if (application.status === "withdrawn") {
                e.preventDefault();
                toast.error("Cannot view CV. Application is withdrawn.");
              }
            }}
            className="text-primary-10 cursor-pointer flex items-center gap-1 hover:underline"
          >
            <FiEye className="size-4" /> View CV
          </a>
        ),
      };
    }) || [];

  const handleSearch = (q: string) => {
    setSearchQuery(q);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setDemoDate("");
  };

  const statusFilterDropdown = (
    <div className="flex items-center gap-3">
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="input input-sm px-3 py-2 border border-neutral-55/60 focus:border-primary-10 transition duration-300 focus:outline-none rounded-md text-sm shadow-sm cursor-pointer"
      >
        <option value="">All</option>
        <option value="applied">Applied</option>
        <option value="withdrawn">Withdrawn</option>
        <option value="shortlisted">Shortlisted</option>
        <option value="appointed">Appointed</option>
        <option value="confirmed">Confirmed</option>
        <option value="rejected">Rejected</option>
      </select>

      <input
        type="date"
        value={demoDate}
        onChange={(e) => setDemoDate(e.target.value)}
        className="input input-sm px-3 py-2 border border-neutral-55/60 focus:border-primary-10 transition duration-300 focus:outline-none rounded-md text-sm shadow-sm cursor-pointer"
      />

      <Button
        label="Clear"
        className="py-2.5 lg:py-2.5 px-3 lg:px-3 text-xs md:text-xs"
        onClick={handleClearFilters}
      />
    </div>
  );
  return (
    <div>
      <Table<any>
        title="Applications Data"
        description="Manage all applications"
        theads={applicationTheads}
        data={tableData || []}
        totalPages={applications?.data?.meta?.totalPages || 1}
        currentPage={page}
        onPageChange={(p) => setPage(p)}
        isLoading={isLoading || isFetching}
        onSearch={handleSearch}
        limit={limit}
        setLimit={setLimit}
        selectedCity={null}
        selectedArea={null}
        children={statusFilterDropdown}
      />

      <UpdateDemoDate
        isDemoDateModalOpen={isDemoDateModalOpen}
        setIsDemoDateModalOpen={setIsDemoDateModalOpen}
        applicationId={applicationId}
        setApplicationId={setApplicationId}
      />

      <UpdateFollowUpStatus
        isUpdateFollowUpModalOpen={isUpdateFollowUpModalOpen}
        setIsUpdateFollowUpModalOpen={setIsUpdateFollowUpModalOpen}
        applicationId={applicationId}
        setApplicationId={setApplicationId}
      />
    </div>
  );
};

export default AllApplications;
