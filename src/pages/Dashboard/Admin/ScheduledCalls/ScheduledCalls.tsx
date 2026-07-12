/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  FiTrash2,
  FiCalendar,
  FiClock,
  FiPhone,
  FiMail,
  FiUser,
  FiEdit2,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import {
  useDeleteScheduledCallMutation,
  useGetAllScheduleCallsQuery,
  useUpdateScheduledCallMutation,
} from "../../../../redux/Features/ScheduleCall/scheduleCallApi";
import type { TableHead } from "../../../../components/Reusable/Table/Table";
import { formatDate } from "../../../../utils/formatDate";
import Button from "../../../../components/Reusable/Button/Button";
import Table from "../../../../components/Reusable/Table/Table";
import Modal from "../../../../components/Reusable/Modal/Modal";
import SelectDropdown from "../../../../components/Reusable/SelectDropdown/SelectDropdown";
import { useForm } from "react-hook-form";

export type TScheduledCall = {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  message?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  scheduledDate?: string;
  scheduledTime?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
};

const ScheduledCalls = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const skip = (page - 1) * limit;
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
  //   const [modalType, setModalType] = useState<"add" | "edit">("edit");
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedCallId, setSelectedCallId] = useState<string | null>(null);

  const { data, isLoading, isFetching, refetch } = useGetAllScheduleCallsQuery({
    page,
    skip,
    limit,
    keyword: searchQuery,
    status: statusFilter,
    scheduledDate: dateFilter,
  });

  const [deleteScheduledCall] = useDeleteScheduledCallMutation();

  // Status style mapping
  const getStatusStyles = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-700",
      contacted: "bg-blue-100 text-blue-700",
      confirmed: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return styles[status] || "bg-gray-100 text-gray-700";
  };

  // Table headers
  const scheduledCallTableHeaders: TableHead[] = [
    { key: "contactInfo", label: "Contact Info" },
    { key: "phone", label: "Phone" },
    { key: "scheduledDateTime", label: "Scheduled Date & Time" },
    { key: "message", label: "Message" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Requested At" },
  ];

  const handleDeleteScheduledCall = async (callId: string, name: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete this call from "${name}"?`,
      )
    ) {
      toast.promise(
        (async () => {
          const result = await deleteScheduledCall(callId).unwrap();
          await refetch();
          return result;
        })(),
        {
          loading: `Deleting scheduled call from "${name}"...`,
          success: `Scheduled call from "${name}" deleted successfully`,
          error: (error: any) =>
            error?.data?.message || "Failed to delete scheduled call",
        },
      );
    }
  };

  // Format table data
  const tableData = data?.data?.data?.map((call: TScheduledCall) => ({
    ...call,
    _id: call._id,

    // Column: Contact Info
    contactInfo: (
      <div className="space-y-1 max-w-[200px]">
        <p className="font-semibold text-gray-800 flex items-center gap-1">
          <FiUser size={14} className="text-gray-400" />
          {call.name}
        </p>
        <p className="text-sm text-gray-600 flex items-center gap-1">
          <FiMail size={14} className="text-gray-400" />
          <span className="truncate">{call.email}</span>
        </p>
      </div>
    ),

    // Column: Phone
    phone: (
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <FiPhone size={14} className="text-gray-400" />
        <span>{call.phoneNumber}</span>
      </div>
    ),

    // Column: Scheduled Date & Time
    scheduledDateTime: (
      <div className="space-y-1">
        {call.scheduledDate && (
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <FiCalendar size={14} className="text-gray-400" />
            <span>{formatDate(call.scheduledDate)}</span>
          </div>
        )}
        {call.scheduledTime && (
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <FiClock size={14} className="text-gray-400" />
            <span>{call.scheduledTime}</span>
          </div>
        )}
        {!call.scheduledDate && !call.scheduledTime && (
          <span className="text-sm text-gray-400">Not scheduled</span>
        )}
      </div>
    ),

    // Column: Message
    message: (
      <p className="text-sm text-gray-600 line-clamp-2 max-w-[200px]">
        {call.message || "No message provided"}
      </p>
    ),

    // Column: Status
    status: (
      <span
        className={`capitalize px-2 py-1 rounded-lg text-xs font-medium ${getStatusStyles(call.status)}`}
      >
        {call.status || "pending"}
      </span>
    ),

    // Column: Created At
    createdAt: formatDate(call.createdAt as any),
  }));

  // Actions
  const actions: any[] = [
    // {
    //   label: "View Details",
    //   icon: <FiEye className="inline text-blue-600" />,
    //   onClick: (row: any) => {
    //     navigate(`/dashboard/admin/scheduled-call/${row._id}`);
    //   },
    // },
    {
      label: "Edit",
      icon: <FiEdit2 className="inline text-green-600" />,
      onClick: (row: any) => {
        setSelectedCallId(row._id);
        setIsEditModalOpen(true);
      },
    },
    {
      label: "Delete",
      icon: <FiTrash2 className="inline text-red-600" />,
      onClick: (row: any) => {
        handleDeleteScheduledCall(
          row._id,
          row.contactInfo.props.children[0].props.children,
        );
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
      <option value="confirmed">Confirmed</option>
      <option value="completed">Completed</option>
      <option value="cancelled">Cancelled</option>
    </select>
  );

  // Date filter
  const dateFilterInput = (
    <input
      type="date"
      value={dateFilter}
      onChange={(e) => setDateFilter(e.target.value)}
      className="input input-sm px-3 py-2 border border-neutral-55/60 focus:border-primary-10 transition duration-300 focus:outline-none rounded-md text-sm shadow-sm"
      placeholder="Filter by date"
    />
  );

  // Combine filters
  const filters = (
    <>
      {statusFilterDropdown}
      {dateFilterInput}
      <Button
        onClick={() => {
          setStatusFilter("");
          setDateFilter("");
          setSearchQuery("");
        }}
        label="Clear Filters"
      />
    </>
  );

  const [updateScheduledCall] = useUpdateScheduledCallMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<any>();

  const handleUpdateScheduledCall = async (data: any) => {
    try {
      const payload = {
        ...data,
      };
      const res = await updateScheduledCall({
        id: selectedCallId,
        data: payload,
      }).unwrap();
      if (res?.success) {
        reset();
        setIsEditModalOpen(false);
      }
    } catch (err: any) {
      const errorMessage =
        err?.data?.message ||
        err?.error ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div>
      <Table<any>
        title={`Scheduled Calls (${data?.data?.meta?.total || 0})`}
        description="Manage all scheduled calls and consultation requests"
        theads={scheduledCallTableHeaders}
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
        selectedCity={null}
        selectedArea={null}
      />

      {/* Edit Modal */}
      <Modal
        heading="Update Status"
        isModalOpen={isEditModalOpen}
        setIsModalOpen={setIsEditModalOpen}
      >
        <form
          onSubmit={handleSubmit(handleUpdateScheduledCall)}
          className="mt-5"
        >
          {/* Edit form will go here */}
          <SelectDropdown
            label="Status"
            options={["pending", "contacted", "confirmed", "cancelled"]}
            error={errors.status}
            {...register("status", { required: "Status is required" })}
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              label="Cancel"
              onClick={() => setIsEditModalOpen(false)}
            />
            <Button
              type="submit"
              label="Save Changes"
              variant="primary"
              isLoading={isSubmitting}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ScheduledCalls;
