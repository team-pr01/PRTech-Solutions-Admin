/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import type {
  TableAction,
  TableHead,
} from "../../../../components/Reusable/Table/Table";
import Table from "../../../../components/Reusable/Table/Table";
import Button from "../../../../components/Reusable/Button/Button";
import {
  useGetAllStaffsQuery,
  useGetSingleStaffByIdQuery,
  useRemoveStaffMutation,
} from "../../../../redux/Features/Staff/staffApi";
import toast from "react-hot-toast";
import { formatDate } from "../../../../utils/formatDate";
import AddOrUpdateStaffModal from "../../../../components/Dashboard/AdminPages/StaffsPage/AddOrUpdateStaffModal/AddOrUpdateStaffModal";

const Staffs = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const { data: allStaffs, isLoading } = useGetAllStaffsQuery({
    page,
    limit,
  });
  const {
    data: singleStaff,
    isLoading: isSingleStaffLoading,
    isFetching: isSingleStaffFetching,
  } = useGetSingleStaffByIdQuery(selectedStaffId);
  const [removeStaff] = useRemoveStaffMutation();
  const [isStaffModalOpen, setIsStaffModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<"add" | "edit">("add");

  const handleRemoveStaff = async (id: string) => {
    try {
      await toast.promise(removeStaff(id).unwrap(), {
        loading: "Loading...",
        success: "Staff removed successfully!",
        error: "Failed to remove staff. Please try again.",
      });
    } catch (err) {
      console.error("Error removing staff:", err);
    }
  };

  // Actions
  const actions: TableAction<any>[] = [
    {
      label: "Edit Info",
      icon: <FiEdit2 className="inline mr-2" />,
      onClick: (row) => {
        setModalType("edit");
        setSelectedStaffId(row?._id);
        setIsStaffModalOpen(true);
      },
    },
    {
      label: "Delete",
      icon: <FiTrash2 className="inline mr-2" />,
      onClick: (row) => {
        handleRemoveStaff(row?.userId);
      },
    },
  ];

  // Table headers
  const staffTheads: TableHead[] = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phoneNumber", label: "Phone Number" },
    { key: "gender", label: "Gender" },
    { key: "location", label: "Location" },
    { key: "jobRole", label: "Job Role" },
    { key: "pagesAssigned", label: "Pages Assigned" },
    { key: "joinedDate", label: "Joined Date" },
  ];

  const tableData = allStaffs?.data?.staffs?.map((staff: any) => ({
    _id: staff?._id || "N/A",
    userId: staff?.userId?._id,
    name: staff?.userId?.name,
    email: staff?.userId?.email,
    phoneNumber: staff?.userId?.phoneNumber,
    gender: staff?.userId?.gender || "N/A",
    location: (
      <div className="space-y-0.5">
        <p className="text-sm text-gray-700">
          {staff?.userId?.country || "N/A"}
        </p>
        {staff?.userId?.city && (
          <p className="text-xs text-gray-500">{staff?.userId?.city}</p>
        )}
      </div>
    ),
    jobRole: staff?.jobRole,
    pagesAssigned: (
      <div className="flex flex-wrap gap-1">
        {staff?.pagesAssigned && staff.pagesAssigned.length > 0 ? (
          staff.pagesAssigned.slice(0, 3).map((page: string, index: number) => (
            <span
              key={index}
              className="inline-block px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded"
            >
              {page}
            </span>
          ))
        ) : (
          <span className="text-gray-400">No pages assigned</span>
        )}
        {staff?.pagesAssigned?.length > 3 && (
          <span className="inline-block px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
            +{staff.pagesAssigned.length - 3} more
          </span>
        )}
      </div>
    ),
    joinedDate: formatDate(staff?.createdAt),
  }));

  const addStaffButton = (
    <Button
      label="Add New Staff"
      onClick={() => {
        setModalType("add");
        setIsStaffModalOpen(true);
      }}
      className="px-3 lg:px-3 py-2 lg:py-2 border-none"
    />
  );

  return (
    <div>
      <Table<any>
        title="All Staffs"
        description="Manage all staff members on the platform."
        theads={staffTheads}
        data={tableData || []}
        totalPages={allStaffs?.data?.meta?.totalPages || 1}
        currentPage={page}
        onPageChange={(p) => setPage(p)}
        isLoading={isLoading}
        actions={actions}
        limit={limit}
        setLimit={setLimit}
        children={addStaffButton}
        selectedCity={null}
        selectedArea={null}
      />

      <AddOrUpdateStaffModal
        isStaffModalOpen={isStaffModalOpen}
        setIsStaffModalOpen={setIsStaffModalOpen}
        modalType={modalType}
        setModalType={setModalType}
        defaultValues={selectedStaffId ? singleStaff?.data : null}
        isLoading={isSingleStaffLoading || isSingleStaffFetching}
      />
    </div>
  );
};

export default Staffs;
