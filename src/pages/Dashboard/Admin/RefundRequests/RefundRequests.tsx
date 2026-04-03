/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  useAcceptRefundRequestMutation,
  useGetAllRefundRequestsQuery,
  useRejectRefundRequestMutation,
} from "../../../../redux/Features/RefundRequest/refundRequestApi";
import type { TableHead } from "../../../../components/Reusable/Table/Table";
import type { TableAction } from "../Guardians/Guardians";
import { FiCheck, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import Table from "../../../../components/Reusable/Table/Table";
import { formatDate } from "../../../../utils/formatDate";

const RefundRequests = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const { data, isLoading, isFetching } = useGetAllRefundRequestsQuery({
    page,
    limit,
    status: statusFilter,
    keyword: searchQuery,
  });
  const [acceptRefundRequest] = useAcceptRefundRequestMutation();
  const [rejectRefundRequest] = useRejectRefundRequestMutation();

  // Table headers
  const refundTheads: TableHead[] = [
    { key: "tutorInfo", label: "Tutor Info" },
    { key: "jobId", label: "Job ID" },
    { key: "tutorUniqueId", label: "Tutor ID" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Date" },
  ];

  // Actions
  const actions: TableAction<any>[] = [
    {
      label: "Accept",
      icon: <FiCheck className="inline text-green-600" />,
      onClick: (row) => {
        handleAcceptRefundRequest({
          id: row?._id,
        });
      },
    },
    {
      label: "Reject",
      icon: <FiX className="inline text-red-600" />,
      onClick: (row) => {
        handleRejectRefundRequest({
          id: row?._id,
          // you can add more fields here if your modal/form needs them
        });
      },
    },
  ];

  // Format table data
  const tableData = data?.data?.refundRequests?.map((refundRequest: any) => ({
    ...refundRequest,

    // Column: Tutor Info (name, email, phone in one cell)
    tutorInfo: (
      <div className="space-y-0.5">
        <p className="font-semibold">{refundRequest?.tutorName || "N/A"}</p>
        <p className="text-sm text-gray-600">
          {refundRequest?.tutorEmail || "N/A"}
        </p>
        <p className="text-sm text-gray-600">
          {refundRequest?.tutorPhoneNumber || "N/A"}
        </p>
      </div>
    ),

    // Column: Job ID
    jobId: refundRequest?.jobId || "N/A",

    // Column: Tutor ID (string, NOT ObjectId)
    tutorUniqueId: refundRequest?.tutorUniqueId || "N/A",

    // Column: Amount
    amount: `${refundRequest.amount} BDT`,

    // Column: Date
    createdAt: formatDate(refundRequest?.createdAt as string),

    // Column: Status
    status: (
      <p
        className={`capitalize px-2 py-1 rounded-xl w-fit font-Nunito ${
          refundRequest?.status === "accepted"
            ? "bg-green-100 text-green-600"
            : refundRequest?.status === "pending"
            ? "bg-yellow-100 text-yellow-600"
            : "bg-red-100 text-red-600" // rejected / others
        }`}
      >
        {refundRequest?.status}
      </p>
    ),
  }));

  const handleSearch = (q: string) => {
    setSearchQuery(q);
  };

  const statusFilterDropdown = (
    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      className="input input-sm px-3 py-2 border border-neutral-55/60 focus:border-primary-10 transition duration-300 focus:outline-none rounded-md text-sm shadow-sm cursor-pointer"
    >
      <option value="">All</option>
      <option value="pending">Pending</option>
      <option value="accepted">Accepted</option>
      <option value="rejected">Rejected</option>
    </select>
  );

  const handleAcceptRefundRequest = async (refundRequest: any) => {
    try {
      await toast.promise(acceptRefundRequest(refundRequest?.id).unwrap(), {
        loading: "Loading...",
        success: "Refund request accepted successfully!",
        error: "Failed to accept refund request. Please try again.",
      });
    } catch (err) {
      console.error("Error deleting notice:", err);
    }
  };

  const handleRejectRefundRequest = async (refundRequest: any) => {
    try {
      await toast.promise(
        rejectRefundRequest({ id: refundRequest?.id }).unwrap(),
        {
          loading: "Loading...",
          success: "Refund request rejected!",
          error: "Failed to reject refund request. Please try again.",
        }
      );
    } catch (err) {
      console.error("Error deleting notice:", err);
    }
  };
  return (
    <div>
      <Table<any>
        title="All Refund Requests"
        description="Manage all refund requests"
        theads={refundTheads}
        data={tableData || []}
        totalPages={data?.data?.meta?.totalPages || 1}
        currentPage={page}
        onPageChange={(p) => setPage(p)}
        isLoading={isLoading || isFetching}
        onSearch={handleSearch}
        actions={actions}
        limit={limit}
        setLimit={setLimit}
        children={statusFilterDropdown}
        selectedCity={null}
        selectedArea={null}
      />
    </div>
  );
};

export default RefundRequests;
