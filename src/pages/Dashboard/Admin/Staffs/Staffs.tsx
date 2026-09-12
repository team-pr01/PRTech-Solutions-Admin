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
import { Link } from "react-router-dom";

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
    { key: "joinedDate", label: "Joined Date" },
  ];

  const tableData = allStaffs?.data?.staffs?.map((staff: any) => ({
    _id: staff?._id || "N/A",
    name: (
      <Link to={`/dashboard/admin/staff/${staff?._id}`} className="underline">
      {staff?.name}
      </Link>
    ),
    email: staff?.email,
    phoneNumber: staff?.phoneNumber,
    gender: (
      <span className="capitalize">{staff?.gender}</span>
    ),
    location: (
      <div className="space-y-0.5">
        <p className="text-sm text-gray-700">
          {staff?.country || "N/A"}
        </p>
        {staff?.city && (
          <p className="text-xs text-gray-500">{staff?.city}</p>
        )}
      </div>
    ),
    jobRole: staff?.jobRole,
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
