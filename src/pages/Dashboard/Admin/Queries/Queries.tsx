/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import type { TableHead } from "../../../../components/Reusable/Table/Table";
import {
  FiEye,
  FiTrash2,
  FiCheckCircle,
  FiMessageCircle,
  FiX,
  FiUser,
  FiMail,
  FiCalendar,
  FiClock,
} from "react-icons/fi";
import Table from "../../../../components/Reusable/Table/Table";
import { formatDate } from "../../../../utils/formatDate";
import Button from "../../../../components/Reusable/Button/Button";
import Modal from "../../../../components/Reusable/Modal/Modal";
import { toast } from "react-hot-toast";
import Textarea from "../../../../components/Reusable/TextArea/TextArea";
import {
  useAnswerQueryMutation,
  useDeleteQueryMutation,
  useGetAllQueriesQuery,
  useUpdateQueryStatusMutation,
} from "../../../../redux/Features/queries/queriesApi";
import { MdDone } from "react-icons/md";

const Queries = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const skip = (page - 1) * limit;
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [queryTypeFilter, setQueryTypeFilter] = useState<string>("");
  const [selectedQueryId, setSelectedQueryId] = useState<string | null>(null);
  const [selectedQuery, setSelectedQuery] = useState<any>(null);
  const [answerText, setAnswerText] = useState<string>("");
  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState<boolean>(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);

  const { data, isLoading, isFetching, refetch } = useGetAllQueriesQuery({
    page,
    limit,
    skip,
    keyword: searchQuery,
    status: statusFilter,
    priority: priorityFilter,
    queryType: queryTypeFilter,
  });

  const [deleteQuery] = useDeleteQueryMutation();
  const [answerQuery] = useAnswerQueryMutation();
  const [updateQueryStatus] = useUpdateQueryStatusMutation();

  // Table headers
  const queryTableHeaders: TableHead[] = [
    { key: "queryInfo", label: "Query Info" },
    { key: "raisedBy", label: "Raised By" },
    { key: "priority", label: "Priority" },
    { key: "queryType", label: "Query Type" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Created Date" },
  ];

  // Priority color mapping
  const getPriorityColor = (priority: string) => {
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
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-red-100 text-red-700";
      case "answered":
        return "bg-yellow-100 text-yellow-700";
      case "closed":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <FiClock size={14} />;
      case "answered":
        return <FiCheckCircle size={14} />;
      default:
        return <FiMessageCircle size={14} />;
    }
  };

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
  const handleAnswerQuery = async () => {
    if (!answerText.trim()) {
      toast.error("Please enter an answer");
      return;
    }

    toast.promise(
      (async () => {
        const result = await answerQuery({
          id: selectedQueryId as string,
          answer: answerText,
        }).unwrap();
        await refetch();
        setIsAnswerModalOpen(false);
        setAnswerText("");
        return result;
      })(),
      {
        loading: "Submitting answer...",
        success: "Query answered successfully",
        error: (error: any) =>
          error?.data?.message || error?.message || "Failed to answer query",
      },
    );
  };

  // Handle answer query
  const handleMArkAsClosed = async (id: string) => {
    try {
      const payload = {
        status: "closed",
      };
      await updateQueryStatus({
        id,
        data: payload,
      }).unwrap();
      await refetch();
    } catch (error) {
      console.error(error);
    }
  };

  // Handle view details
  const handleViewDetails = (row: any) => {
    setSelectedQuery(row);
    setIsDetailsModalOpen(true);
  };

  // Format table data
  const tableData = data?.data?.data?.map((query: any) => ({
    ...query,
    _id: query._id,

    // Column: Query Info
    queryInfo: (
      <div className="space-y-0.5">
        <p className="font-semibold text-gray-800">{query.subject || "N/A"}</p>
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

    // Column: Query Type
    queryType: (
      <span className="inline-block px-2 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-700">
        {query.queryType}
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
        handleViewDetails(row);
      },
    },
    {
      label: "Answer",
      icon: <FiMessageCircle className="inline text-green-600" />,
      onClick: (row: any) => {
        if (row.status === "answered") {
          toast.error("This query has already been answered");
          return;
        }
        setSelectedQueryId(row._id);
        setIsAnswerModalOpen(true);
      },
    },
    {
      label: "Mark As Closed",
      icon: <MdDone className="inline text-green-600" />,
      onClick: (row: any) => {
        handleMArkAsClosed(row?._id);
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

  // Query Type filter dropdown
  const queryTypeFilterDropdown = (
    <select
      value={queryTypeFilter}
      onChange={(e) => setQueryTypeFilter(e.target.value)}
      className="input input-sm px-3 py-2 border border-neutral-55/60 focus:border-primary-10 transition duration-300 focus:outline-none rounded-md text-sm shadow-sm cursor-pointer"
    >
      <option value="">All Types</option>
      <option value="Technical">Technical</option>
      <option value="Billing">Billing</option>
      <option value="Feature Request">Feature Request</option>
      <option value="General">General</option>
      <option value="Other">Other</option>
    </select>
  );

  // Combine filters
  const filters = (
    <div className="flex flex-wrap gap-2">
      {statusFilterDropdown}
      {priorityFilterDropdown}
      {queryTypeFilterDropdown}
    </div>
  );

  return (
    <div>
      <Table<any>
        title="All Queries"
        description="Manage customer queries, provide answers, and track support requests"
        theads={queryTableHeaders}
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

      {/* Query Details Modal */}
      {isDetailsModalOpen && selectedQuery && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Query Details
              </h2>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {/* Subject */}
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Subject
                </label>
                <p className="text-gray-800 font-semibold text-lg mt-1">
                  {selectedQuery.subject}
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Description
                </label>
                <p className="text-gray-700 mt-1 whitespace-pre-wrap">
                  {selectedQuery.description}
                </p>
              </div>

              {/* Status & Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Status
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={getStatusColor(selectedQuery.status)}>
                      {getStatusIcon(selectedQuery.status)}
                    </span>
                    <span
                      className={`capitalize px-2 py-1 rounded-lg text-sm font-medium ${getStatusColor(selectedQuery.status)}`}
                    >
                      {selectedQuery.status}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Priority
                  </label>
                  <div className="mt-1">
                    <span
                      className={`inline-block px-2 py-1 rounded-lg text-sm font-medium capitalize ${getPriorityColor(selectedQuery.priority)}`}
                    >
                      {selectedQuery.priority}
                    </span>
                  </div>
                </div>
              </div>

              {/* Query Type */}
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Query Type
                </label>
                <p className="text-gray-800 mt-1">{selectedQuery.queryType}</p>
              </div>

              {/* Raised By */}
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Raised By
                </label>
                <div className="mt-1 space-y-1">
                  <p className="text-gray-800 flex items-center gap-2">
                    <FiUser size={14} className="text-gray-400" />
                    {selectedQuery.raisedBy?.name || "N/A"}
                  </p>
                  <p className="text-gray-500 text-sm flex items-center gap-2">
                    <FiMail size={14} className="text-gray-400" />
                    {selectedQuery.raisedBy?.email || "N/A"}
                  </p>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Created At
                  </label>
                  <p className="text-gray-800 mt-1 flex items-center gap-2">
                    <FiCalendar size={14} className="text-gray-400" />
                    {formatDate(selectedQuery.createdAt)}
                  </p>
                </div>
                {selectedQuery.answeredAt && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Answered At
                    </label>
                    <p className="text-green-600 mt-1 flex items-center gap-2">
                      <FiCheckCircle size={14} />
                      {formatDate(selectedQuery.answeredAt)}
                    </p>
                  </div>
                )}
              </div>

              {/* Answer Section */}
              {selectedQuery.answer ? (
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <label className="text-sm font-medium text-green-800 mb-2 flex items-center gap-2">
                    <FiCheckCircle size={14} />
                    Answer
                  </label>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedQuery.answer}
                  </p>
                </div>
              ) : (
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200 text-center">
                  <FiClock className="mx-auto text-yellow-500 mb-2" size={24} />
                  <p className="text-yellow-700">No answer yet</p>
                  <p className="text-sm text-yellow-600 mt-1">
                    This query is waiting for a response
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                label="Close"
                onClick={() => setIsDetailsModalOpen(false)}
              />
              {selectedQuery.status !== "answered" && (
                <Button
                  type="button"
                  variant="primary"
                  label="Answer Query"
                  onClick={() => {
                    setIsDetailsModalOpen(false);
                    setSelectedQueryId(selectedQuery._id);
                    setIsAnswerModalOpen(true);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Answer Query Modal */}
      <Modal
        heading="Answer Query"
        isModalOpen={isAnswerModalOpen}
        setIsModalOpen={setIsAnswerModalOpen}
      >
        <div className="space-y-4 mt-5">
          <Textarea
            name="answer"
            label="Answer"
            placeholder="Enter your answer here..."
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            rows={6}
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              label="Cancel"
              onClick={() => {
                setIsAnswerModalOpen(false);
                setAnswerText("");
              }}
            />
            <Button
              type="button"
              variant="primary"
              label="Submit Answer"
              onClick={handleAnswerQuery}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Queries;
