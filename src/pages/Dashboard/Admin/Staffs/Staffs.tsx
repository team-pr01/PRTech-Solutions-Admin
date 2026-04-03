/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import type {
  TableAction,
  TableHead,
} from "../../../../components/Reusable/Table/Table";
import Table from "../../../../components/Reusable/Table/Table";
import Button from "../../../../components/Reusable/Button/Button";
import AddNewStaffModal from "../../../../components/Admin/StaffsPage/AddOrUpdateStaffModal/AddOrUpdateStaffModal";
import {
  useGetAllStaffsQuery,
  useGetSingleStaffByIdQuery,
  useRemoveStaffMutation,
} from "../../../../redux/Features/Staff/staffApi";
import toast from "react-hot-toast";
import type { TStaff } from "../../../../types/staff.types";
import { formatDate } from "../../../../utils/formatDate";

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

  // Table headers
  const staffTheads: TableHead[] = [
    { key: "staffId", label: "ID" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phoneNumber", label: "Phone Number" },
    { key: "jobRole", label: "Job Role" },
    { key: "joinedDate", label: "Joined Date" },
  ];

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

  const tableData = allStaffs?.data?.staffs?.map((staff: TStaff) => ({
    _id: staff?._id || "N/A",
    staffId: staff?.staffId || "N/A",
    userId: staff?.userId?._id,
    name: staff?.userId?.name,
    email: staff?.userId?.email,
    phoneNumber: staff?.userId?.phoneNumber,
    jobRole: staff?.jobRole,
    pagesAssigned: staff?.pagesAssigned,
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

      <AddNewStaffModal
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