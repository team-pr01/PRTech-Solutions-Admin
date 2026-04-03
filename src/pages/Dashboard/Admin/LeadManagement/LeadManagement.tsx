/* eslint-disable @typescript-eslint/no-explicit-any */
import Table, {
  type TableAction,
  type TableHead,
} from "../../../../components/Reusable/Table/Table";
import React, { useState } from "react";
import { FaCheck, FaMoneyBillWave } from "react-icons/fa";
import { MdCancel, MdOutlineRemoveRedEye } from "react-icons/md";
import {
  useGetAllLeadsQuery,
  useUpdateLeadInfoMutation,
} from "../../../../redux/Features/Lead/leadApi";
import { formatDate } from "../../../../utils/formatDate";
import toast from "react-hot-toast";
import {
  HiOutlineCollection,
  HiOutlineUserGroup,
  HiOutlineAcademicCap,
} from "react-icons/hi";
import Modal from "../../../../components/Reusable/Modal/Modal";

const LeadManagement = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(50);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("");
  const [isViewLeadModalOpen, setIsViewLeadModalOpen] =
    useState<boolean>(false);
  const [selectedLead, setSelectedLead] = useState<string | null>(null);

  const {
    data: allLeads,
    isLoading,
    isFetching,
  } = useGetAllLeadsQuery({
    keyword: searchQuery,
    page,
    limit,
    addedBy: activeTab === "" ? "" : activeTab,
  });

  //   Table heads
  const leadTheads: TableHead[] = [
    { key: "leadId", label: "Lead ID" },
    { key: "tutorId", label: "Tutor ID" },
    { key: "addedBy", label: "Added By" },
    { key: "guardianPhoneNumber", label: "Guardian Phone Number" },
    { key: "class", label: "Class" },
    { key: "address", label: "Guardian Address" },
    { key: "details", label: "Details" },
    { key: "createdAt", label: "Added On" },
    { key: "paymentDetails", label: "Payment Details" },
    { key: "status", label: "Status" },
  ];

  // Format table data
  const tableData = allLeads?.data?.leads?.map((lead: any) => ({
    ...lead,
    leadId: lead?.leadId || "N/A",
    _id: lead?._id || "N/A",
    tutorId: lead?.tutorCustomId || "N/A",
    class: lead?.class || "N/A",
    address: lead?.address || "N/A",
    details: lead?.details || "N/A",
    addedBy: (
      <p>
        {lead?.userName ? lead?.userName : "N/A"}
        <span className="block">
          {lead?.userPhoneNumber ? lead?.userPhoneNumber : ""}
        </span>
      </p>
    ),
    paymentDetails: (
      <p>
        {lead?.paymentMethod ? lead?.paymentMethod : "N/A"}
        <span className="block">
          {lead?.paymentAccountNumber ? lead?.paymentAccountNumber : ""}
        </span>
      </p>
    ),
    status: (
      <div
        className={`px-2 py-1 rounded-xl font-Nunito w-fit capitalize ${
          lead?.status === "confirmed" || lead?.status === "paid"
            ? "bg-green-100 text-green-600"
            : lead?.status === "accepted"
            ? "bg-blue-100 text-primary-10"
            : lead?.status === "pending"
            ?
            "bg-orange-100 text-orange-600"
            :
            "bg-red-200/90 text-red-600"
        }`}
      >
        {lead?.status}
      </div>
    ),
    createdAt: formatDate(lead?.createdAt),
  }));

  const [updateLeadInfo] = useUpdateLeadInfoMutation();

  const handleUpdateLeadStatus = async (id: string, status: string) => {
    try {
      const payload = {
        status,
      };
      await toast.promise(updateLeadInfo({ id, data: payload }).unwrap(), {
        loading: "Loading...",
        success: `Status updated to ${status}`,
        error: "Failed to update status. Please try again.",
      });
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to update status. Please try again."
      );
    }
  };

  const actions: TableAction<any>[] = [
    {
      label: "View Details",
      icon: <MdOutlineRemoveRedEye className="text-primary-10" />,
      onClick: (row) => {
        setSelectedLead(row?.details);
        setIsViewLeadModalOpen(true);
      },
    },
    {
      label: "Accept",
      icon: <FaCheck className="text-green-600" />,
      onClick: (row) => handleUpdateLeadStatus(row._id, "accepted"),
    },
    {
      label: "Confirm",
      icon: <FaCheck className="text-green-600" />,
      onClick: (row) => handleUpdateLeadStatus(row._id, "confirmed"),
    },
    {
      label: "Cancel",
      icon: <MdCancel className="text-red-600" />,
      onClick: (row) => handleUpdateLeadStatus(row._id, "cancelled"),
    },
    {
      label: "Mark as Paid",
      icon: <FaMoneyBillWave className="text-green-600" />,
      onClick: (row) => handleUpdateLeadStatus(row._id, "paid"),
    },
  ];

  const handleSearch = (q: string) => {
    setSearchQuery(q);
  };
  const counts = allLeads?.data?.meta || {};
  const leadTypes = [
    {
      id: 1,
      key: "",
      title: "All Leads",
      count: counts?.totalLeads || 0,
      icon: <HiOutlineCollection />,
    },
    {
      id: 2,
      key: "guardian",
      title: "Leads from Guardian",
      count: counts?.guardianLeads || 0,
      icon: <HiOutlineUserGroup />,
    },
    {
      id: 3,
      key: "tutor",
      title: "Leads from Tutor",
      count: counts?.tutorLeads || 0,
      icon: <HiOutlineAcademicCap />,
    },
  ];

  return (
    <div>
      {/* Tabs Bar */}
      <div className="border-b border-blue-300 sticky top-0 z-15 bg-[#F2F5FC] px-3 lg:px-6 pt-6 pb-2">
        <div className="flex w-full overflow-x-auto overflow-y-hidden gap-6 md:gap-10">
          {leadTypes.map((tab) => {
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab?.(tab.key)}
                className={`
                        relative py-3 text-xs md:text-sm lg:text-base flex items-center gap-1 md:gap-2
                        font-medium transition-colors duration-200 cursor-pointer
                        ${
                          isActive
                            ? "text-primary-10"
                            : "text-slate-500 hover:text-primary-500"
                        }
                      `}
              >
                {/* Icon */}
                <span className="flex items-center justify-center">
                  {React.cloneElement(
                    tab.icon as React.ReactElement,
                    {
                      className: `size-3 md:size-4 ${
                        isActive ? "opacity-100" : "opacity-70"
                      }`,
                    } as any
                  )}
                </span>

                {/* Label + count */}
                <span className="whitespace-nowrap text-xs md:text-sm lg:text-base">
                  {tab.title}{" "}
                  <span className={isActive ? "font-semibold" : "font-normal"}>
                    {String(tab.count).padStart(2, "0")}
                  </span>
                </span>

                {/* Active underline */}
                {isActive && (
                  <span className="absolute left-0 right-0 -bottom-[1px] h-[3px] rounded-full bg-primary-500" />
                )}
              </button>
            );
          })}
        </div>

        {/* <Link
                  to="/dashboard/guardian/hire-a-tutor"
                  className={`bg-primary-10 hover:bg-primary-20 hover:text-primary-10 transition duration-300 font-semibold text-white rounded-lg flex items-center gap-2 px-3 py-2 pointer`}
                >
                  Hire a Tutor <RxArrowTopRight className="text-lg" />
                </Link> */}
      </div>

      <div className="px-3 lg:px-6 py-6">
        <Table<any>
          title="All Leads & Tuition Requests"
          description="Manage all leads here."
          theads={leadTheads}
          data={tableData || []}
          actions={actions}
          totalPages={allLeads?.data?.meta?.totalPages}
          currentPage={page}
          onPageChange={(p) => setPage(p)}
          isLoading={isLoading || isFetching}
          onSearch={handleSearch}
          limit={limit}
          setLimit={setLimit}
          selectedCity={null}
          selectedArea={null}
        />
      </div>

      {/* View lead details modal */}
      <Modal
        heading="Lead Details"
        isModalOpen={isViewLeadModalOpen}
        setIsModalOpen={setIsViewLeadModalOpen}
        width="w-[95%] md:w-[80%] lg:w-[60%] xl:w-[40%] 2xl:w-[25%] h-[90vh] 2xl:h-fit overflow-y-auto"
      >
        <p className="text-neutral-10 mt-5 font-Nunito">{selectedLead}</p>
      </Modal>
    </div>
  );
};

export default LeadManagement;
