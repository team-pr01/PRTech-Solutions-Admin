/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useDeleteIssueMutation,
  useGetAllIssuesQuery,
  useUpdateIssueStatusMutation,
} from "../../../../redux/Features/issues/issuesApi";
import { useState } from "react";
import type { TableHead } from "../../../../components/Reusable/Table/Table";
import { FiEye, FiTrash2, FiCheckCircle, FiClock, FiMessageCircle, FiXCircle } from "react-icons/fi";
import Table from "../../../../components/Reusable/Table/Table";
import { formatDate } from "../../../../utils/formatDate";
import { toast } from "react-hot-toast";
import { MdDone } from "react-icons/md";
import { useNavigate } from "react-router-dom";

// Priority color mapping
export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "urgent":
      return "bg-red-100 text-red-700";
    case "high":
      return "bg-orange-100 text-orange-700";
    case "medium":
      return "bg-yellow-100 text-yellow-700";
    case "low":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

// Status color mapping
export const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-red-100 text-red-700";
    case "ongoing":
      return "bg-blue-100 text-blue-700";
    case "resolved":
      return "bg-yellow-100 text-yellow-700";
    case "closed":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const Issues = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const skip = (page - 1) * limit;
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");

  const { data, isLoading, isFetching, refetch } = useGetAllIssuesQuery({
    page,
    limit,
    skip,
    keyword: searchQuery,
    status: statusFilter,
    priority: priorityFilter,
  });

  const [deleteQuery] = useDeleteIssueMutation();
  const [updateIssueStatus] = useUpdateIssueStatusMutation();

  // Handle delete query
  const handleDeleteQuery = async (id: string, subject: string) => {
    if (window.confirm(`Are you sure you want to delete "${subject}"?`)) {
      toast.promise(
        (async () => {
          const result = await deleteQuery(id).unwrap();
          await refetch();
          return result;
        })(),
        {
          loading: `Deleting query "${subject}"...`,
          success: `Query "${subject}" deleted successfully`,
          error: (error: any) =>
            error?.data?.message || error?.message || "Failed to delete query",
        },
      );
    }
  };

  // Handle answer query
  const handleUpdateIssueStatus = async (id: string, status: string) => {
    try {
      const payload = {
        status,
      };
      await updateIssueStatus({
        id,
        data: payload,
      }).unwrap();
      await refetch();
    } catch (error) {
      console.error(error);
    }
  };

  // Table headers
  const issueTableHeaders: TableHead[] = [
    { key: "issueInfo", label: "Query Info" },
    { key: "raisedBy", label: "Raised By" },
    { key: "project", label: "Project" },
    { key: "priority", label: "Priority" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Created Date" },
  ];

  // Format table data
  const tableData = data?.data?.data?.map((query: any) => ({
    ...query,
    _id: query._id,

    // Column: Query Info
    issueInfo: (
      <div className="space-y-0.5">
        <p className="font-semibold text-gray-800">{query.title || "N/A"}</p>
        <p className="text-sm text-gray-500 line-clamp-2 max-w-[300px]">
          {query.description || "N/A"}
        </p>
        {query.answer && (
          <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
            <FiCheckCircle size={12} />
            <span className="font-medium">Answered:</span>{" "}
            {query.answer.length > 100
              ? `${query.answer.slice(0, 100)}...`
              : query.answer}
          </p>
        )}
      </div>
    ),

    // Column: Raised By
    raisedBy: (
      <div className="space-y-0.5">
        <p className="text-sm font-medium text-gray-800">
          {query.raisedBy?.name || "N/A"}
        </p>
        <p className="text-xs text-gray-500">
          {query.raisedBy?.email || "N/A"}
        </p>
      </div>
    ),

    // Column: Project
    project: query.project?.name,

    // Column: Priority
    priority: (
      <span
        className={`inline-block px-2 py-1 rounded-lg text-xs font-medium capitalize ${getPriorityColor(
          query.priority,
        )}`}
      >
        {query.priority}
      </span>
    ),

    // Column: Status
    status: (
      <span
        className={`inline-block px-2 py-1 rounded-lg text-xs font-medium capitalize ${getStatusColor(
          query.status,
        )}`}
      >
        {query.status}
      </span>
    ),

    // Column: Created Date
    createdAt: formatDate(query.createdAt),
  }));

  // Actions
  const actions: any[] = [
    {
      label: "View Details",
      icon: <FiEye className="inline text-blue-600" />,
      onClick: (row: any) => {
        navigate(`/dashboard/admin/issue/${row?._id}`);
      },
    },
    {
      label: "Mark as Ongoing",
      icon: <FiClock className="inline text-blue-600" />,
      onClick: (row: any) => {
        handleUpdateIssueStatus(row?._id, "ongoing");
      },
    },
    {
      label: "Mark as Resolved",
      icon: <FiCheckCircle className="inline text-green-600" />,
      onClick: (row: any) => {
        handleUpdateIssueStatus(row?._id, "resolved");
      },
    },
    {
      label: "Mark as Closed",
      icon: <MdDone className="inline text-green-600" />,
      onClick: (row: any) => {
        handleUpdateIssueStatus(row?._id, "closed");
      },
    },
    {
      label: "Need to Discuss",
      icon: <FiMessageCircle className="inline text-yellow-600" />,
      onClick: (row: any) => {
        handleUpdateIssueStatus(row?._id, "needToDiscuss");
      },
    },
    {
      label: "Cancelled",
      icon: <FiXCircle className="inline text-red-600" />,
      onClick: (row: any) => {
        handleUpdateIssueStatus(row?._id, "cancelled");
      },
    },
    {
      label: "Delete",
      icon: <FiTrash2 className="inline text-red-600" />,
      onClick: (row: any) => {
        handleDeleteQuery(row._id, row.subject);
      },
    },
  ];

  const handleSearch = (q: string) => {
    setSearchQuery(q);
  };

  // Status filter dropdown
  const statusFilterDropdown = (
    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      className="input input-sm px-3 py-2 border border-neutral-55/60 focus:border-primary-10 transition duration-300 focus:outline-none rounded-md text-sm shadow-sm cursor-pointer"
    >
      <option value="">All Status</option>
      <option value="pending">Pending</option>
      <option value="answered">Answered</option>
      <option value="closed">Closed</option>
    </select>
  );

  // Priority filter dropdown
  const priorityFilterDropdown = (
    <select
      value={priorityFilter}
      onChange={(e) => setPriorityFilter(e.target.value)}
      className="input input-sm px-3 py-2 border border-neutral-55/60 focus:border-primary-10 transition duration-300 focus:outline-none rounded-md text-sm shadow-sm cursor-pointer"
    >
      <option value="">All Priority</option>
      <option value="urgent">Urgent</option>
      <option value="high">High</option>
      <option value="medium">Medium</option>
      <option value="low">Low</option>
    </select>
  );

  // Combine filters
  const filters = (
    <div className="flex flex-wrap gap-2">
      {statusFilterDropdown}
      {priorityFilterDropdown}
    </div>
  );

  return (
    <div>
      <Table<any>
        title="All Issues"
        description="Manage all issues raised by clients."
        theads={issueTableHeaders}
        data={tableData || []}
        totalPages={data?.data?.meta?.totalPages || 1}
        currentPage={page}
        onPageChange={(p) => setPage(p)}
        isLoading={isLoading || isFetching}
        onSearch={handleSearch}
        actions={actions}
        limit={limit}
        setLimit={setLimit}
        children={filters}
      />
    </div>
  );
};

export default Issues;
