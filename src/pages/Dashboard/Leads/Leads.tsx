/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  FiEye,
  FiEdit2,
  FiTrash2,
  FiCalendar,
  FiFlag,
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  useDeleteLeadMutation,
  useGetAllLeadsQuery,
} from "../../../redux/Features/Lead/leadApi";
import type { TableHead } from "../../../components/Reusable/Table/Table";
import { formatDate } from "../../../utils/formatDate";
import Table from "../../../components/Reusable/Table/Table";
import Modal from "../../../components/Reusable/Modal/Modal";
import ScheduleDiscoveryCall from "../../../components/Dashboard/LeadPage/ScheduleDiscoveryCall/ScheduleDiscoveryCall";
import AddFollowUp from "../../../components/Dashboard/LeadPage/AddFollowUp/AddFollowUp";
import ViewFollowUps from "../../../components/Dashboard/LeadPage/ViewFollowUps/ViewFollowUps";
import Button from "../../../components/Reusable/Button/Button";
import Category from "../../../components/Reusable/Category/Category";
import { useGetAllCategoriesByAreaNameQuery } from "../../../redux/Features/Categories/categoriesApi";
import AddOrEditLead from "../../../components/Dashboard/LeadPage/AddOrEditLead/AddOrEditLead";

const Leads = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [countryFilter, setCountryFilter] = useState<string>("");
  const [cityFilter, setCityFilter] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [discoveryCallDateFilter, setDiscoveryCallDateFilter] =
    useState<string>("");
  const [followUpDateFilter, setFollowUpDateFilter] = useState<string>("");
  const [modalType, setModalType] = useState<"add" | "edit">("add");
  const [selectedLeadId, setSelectedLeadId] = useState<any>(null);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [isAddOrEditLeadModalOpen, setIsAddOrEditLeadModalOpen] =
    useState<boolean>(false);
  const [
    isScheduleDiscoveryCallModalOpen,
    setIsScheduleDiscoveryCallModalOpen,
  ] = useState<boolean>(false);
  const [isAddFollowUpModalOpen, setIsAddFollowUpModalOpen] =
    useState<boolean>(false);
  const [isViewFollowUpsOpen, setIsViewFollowUpsOpen] =
    useState<boolean>(false);

  const [deleteLead] = useDeleteLeadMutation();

  const { data, isLoading, isFetching, refetch } = useGetAllLeadsQuery({
    page,
    limit,
    keyword: searchQuery,
    status: statusFilter,
    country: countryFilter,
    city: cityFilter,
    category,
    priority: priorityFilter,
    discoveryCallScheduledDate: discoveryCallDateFilter,
    followUpDate: followUpDateFilter,
  });
  const { data: categories } = useGetAllCategoriesByAreaNameQuery("Lead");

  // Status style mapping
  const statusStyles: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-700",
    Ongoing: "bg-blue-100 text-blue-700",
    "Discovery Call Scheduled": "bg-purple-100 text-purple-700",
    Closed: "bg-green-100 text-green-700",
    "Not Interested": "bg-red-100 text-red-700",
    "For Future": "bg-gray-100 text-gray-700",
  };

  // Priority style mapping
  const getPriorityStyles = (priority: number) => {
    if (priority >= 4) return "bg-red-100 text-red-700";
    if (priority === 3) return "bg-orange-100 text-orange-700";
    return "bg-green-100 text-green-700";
  };

  // Table headers
  const leadTableHeaders: TableHead[] = [
    { key: "businessInfo", label: "Business Info" },
    { key: "contactInfo", label: "Contact Info" },
    { key: "location", label: "Location" },
    { key: "priority", label: "Priority" },
    { key: "category", label: "Category" },
    { key: "nextFollowUp", label: "Next Follow Up" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Created Date" },
  ];

  const handleDeleteLead = async (leadId: string, businessName: string) => {
    if (window.confirm(`Are you sure you want to delete "${businessName}"?`)) {
      toast.promise(
        (async () => {
          const result = await deleteLead(leadId).unwrap();
          await refetch();
          return result;
        })(),
        {
          loading: `Deleting lead "${businessName}"...`,
          success: `Lead "${businessName}" deleted successfully`,
          error: (error: any) =>
            error?.data?.message || "Failed to delete lead",
        },
      );
    }
  };

  // Get next follow up date
  const getNextFollowUp = (followUps: any[]) => {
    if (!followUps || followUps.length === 0) return "No follow ups";
    const now = new Date();
    const upcomingFollowUps = followUps.filter(
      (followUp) => new Date(followUp.followUpDate) > now,
    );
    if (upcomingFollowUps.length === 0) return "No upcoming";
    const nextFollowUp = upcomingFollowUps.sort(
      (a, b) =>
        new Date(a.followUpDate).getTime() - new Date(b.followUpDate).getTime(),
    )[0];
    return formatDate(nextFollowUp.followUpDate);
  };

  // Format table data
  const tableData = data?.data?.data?.map((lead: any) => ({
    ...lead,
    _id: lead._id,

    // Column: Business Info
    businessInfo: (
      <div className="space-y-1">
        <p className="font-semibold text-gray-800">{lead.businessName}</p>
        {lead.businessContactNumber !== lead.ownerContactNumber && (
          <p className="text-xs text-gray-500">
            Business: {lead.businessContactNumber}
          </p>
        )}
        {lead.website && (
          <a
            href={lead.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary-10 hover:underline block"
          >
            {lead.website}
          </a>
        )}
        {lead.issueFound && (
          <p
            className="text-xs text-gray-500 truncate max-w-[200px]"
            title={lead.issueFound}
          >
            {lead.issueFound}
          </p>
        )}
      </div>
    ),

    // Column: Contact Info
    contactInfo: (
      <div className="space-y-1">
        <p className="text-sm text-gray-700">
          <span className="font-medium">Owner:</span> {lead.ownerName || "N/A"}
        </p>
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <FiPhone size={12} className="text-gray-400" />
          <span>{lead.ownerContactNumber || "N/A"}</span>
          {lead.isWhatsapp && (
            <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
              WhatsApp
            </span>
          )}
        </div>
        {lead.ownerEmail && (
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <FiMail size={12} className="text-gray-400" />
            <span className="truncate max-w-[150px]">{lead.ownerEmail}</span>
          </div>
        )}
      </div>
    ),

    // Column: Location
    location: (
      <div className="space-y-1">
        <div className="flex items-center gap-1 text-sm text-gray-700">
          <FiMapPin size={12} className="text-gray-400" />
          <span>{lead.country}</span>
        </div>
        {lead.city && <p className="text-sm text-gray-600">{lead.city}</p>}
        {lead.address && (
          <p
            className="text-xs text-gray-500 truncate max-w-[150px]"
            title={lead.address}
          >
            {lead.address}
          </p>
        )}
      </div>
    ),

    // Column: Priority
    priority: (
      <div className="flex items-center gap-2">
        <FiFlag
          size={16}
          className={
            lead.priority >= 4
              ? "text-red-500"
              : lead.priority === 3
                ? "text-orange-500"
                : "text-green-500"
          }
        />
        <span
          className={`px-2 py-1 rounded-lg text-sm font-medium inline-block ${getPriorityStyles(lead.priority)}`}
        >
          Priority {lead.priority}/5
        </span>
      </div>
    ),

    // Column: Category
    category: (
      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm inline-block">
        {lead.category}
      </span>
    ),

    // Column: Next Follow Up
    nextFollowUp: (
      <div className="space-y-1">
        <button
          onClick={() => {
            setSelectedLeadId(lead._id);
            setSelectedLead(lead);
            setIsViewFollowUpsOpen(true);
          }}
          className="text-primary-10 underline"
        >
          View Follow Ups
        </button>
        <div className="flex items-center gap-1 text-sm">
          <FiCalendar size={12} className="text-gray-400" />
          <span
            className={
              getNextFollowUp(lead.followUps) !== "No upcoming" &&
              getNextFollowUp(lead.followUps) !== "No follow ups"
                ? "text-primary-10 font-medium"
                : "text-gray-500"
            }
          >
            {getNextFollowUp(lead.followUps)}
          </span>
        </div>
        {lead.nextAction && (
          <p
            className="text-xs text-gray-500 truncate max-w-[150px]"
            title={lead.nextAction}
          >
            Next action: {lead.nextAction}
          </p>
        )}
      </div>
    ),

    // Column: Status
    status: (
      <div className="space-y-2">
        <span
          className={`capitalize px-2 py-1 rounded-xl text-sm font-medium inline-block ${
            statusStyles[lead.status] || "bg-gray-100 text-gray-600"
          }`}
        >
          {lead.status}
        </span>
        {lead.status === "Discovery Call Scheduled" &&
          lead.discoveryCallScheduledDate && (
            <div className="flex flex-col gap-0.5 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <FiCalendar size={10} className="text-purple-500" />
                <span>{formatDate(lead.discoveryCallScheduledDate)}</span>
              </div>
              {lead.discoveryCallScheduledTime && (
                <div className="flex items-center gap-1">
                  <FiClock size={10} className="text-purple-500" />
                  <span>{lead.discoveryCallScheduledTime}</span>
                </div>
              )}
            </div>
          )}
      </div>
    ),

    // Column: Created Date
    createdAt: formatDate(lead.createdAt),
  }));

  // Actions
  const actions: any[] = [
    {
      label: "View Details",
      icon: <FiEye className="inline text-blue-600" />,
      onClick: (row: any) => {
        navigate(`/dashboard/admin/leads/${row._id}`);
      },
    },
    {
      label: "Edit Lead",
      icon: <FiEdit2 className="inline text-green-600" />,
      onClick: (row: any) => {
        setSelectedLeadId(row?._id);
        setModalType("edit");
        setIsAddOrEditLeadModalOpen(true);
      },
    },
    {
      label: "Schedule Discovery Call",
      icon: <FiCalendar className="inline text-purple-600" />,
      onClick: (row: any) => {
        setSelectedLead(row);
        setIsScheduleDiscoveryCallModalOpen(true);
      },
    },
    {
      label: "Add Follow Up",
      icon: <FiCalendar className="inline text-primary-10" />,
      onClick: (row: any) => {
        setSelectedLeadId(row?._id);
        setIsAddFollowUpModalOpen(true);
      },
    },
    {
      label: "Delete Lead",
      icon: <FiTrash2 className="inline text-red-600" />,
      onClick: (row: any) => {
        handleDeleteLead(
          row._id,
          row.businessInfo.props.children[0].props.children,
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
      <option value="Pending">Pending</option>
      <option value="Ongoing">Ongoing</option>
      <option value="Discovery Call Scheduled">Discovery Call Scheduled</option>
      <option value="Closed">Closed</option>
      <option value="Not Interested">Not Interested</option>
      <option value="For Future">For Future</option>
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
      <option value="1">Priority 1 (Highest)</option>
      <option value="2">Priority 2 (High)</option>
      <option value="3">Priority 3 (Medium)</option>
      <option value="4">Priority 4 (Low)</option>
      <option value="5">Priority 5 (Lowest)</option>
    </select>
  );

  // Country filter input
  const countryFilterInput = (
    <input
      type="text"
      value={countryFilter}
      onChange={(e) => setCountryFilter(e.target.value)}
      placeholder="Filter by country"
      className="input input-sm px-3 py-2 border border-neutral-55/60 focus:border-primary-10 transition duration-300 focus:outline-none rounded-md text-sm shadow-sm"
    />
  );

  // City filter input
  const cityFilterInput = (
    <input
      type="text"
      value={cityFilter}
      onChange={(e) => setCityFilter(e.target.value)}
      placeholder="Filter by city"
      className="input input-sm px-3 py-2 border border-neutral-55/60 focus:border-primary-10 transition duration-300 focus:outline-none rounded-md text-sm shadow-sm"
    />
  );

  // Discovery Call Date filter
  const discoveryCallDateFilterInput = (
    <input
      type="date"
      value={discoveryCallDateFilter}
      onChange={(e) => setDiscoveryCallDateFilter(e.target.value)}
      className="input input-sm px-3 py-2 border border-neutral-55/60 focus:border-primary-10 transition duration-300 focus:outline-none rounded-md text-sm shadow-sm"
    />
  );

  // Follow Up Date filter
  const followUpDateFilterInput = (
    <input
      type="date"
      value={followUpDateFilter}
      onChange={(e) => setFollowUpDateFilter(e.target.value)}
      className="input input-sm px-3 py-2 border border-neutral-55/60 focus:border-primary-10 transition duration-300 focus:outline-none rounded-md text-sm shadow-sm"
    />
  );

  // Combine filters
  const filters = (
    <>
      {statusFilterDropdown}
      {priorityFilterDropdown}
      {countryFilterInput}
      {cityFilterInput}
      <div className="relative group">
        <button className="px-3 py-2 border border-neutral-55/60 rounded-md text-sm shadow-sm bg-white">
          Date Filters ▼
        </button>
        <div className="absolute right-0 mt-0 w-64 bg-white border border-neutral-45/50 rounded-md shadow-lg hidden group-hover:block z-10 p-3 space-y-2">
          <div>
            <label className="text-xs text-gray-600">Discovery Call Date</label>
            {discoveryCallDateFilterInput}
          </div>
          <div>
            <label className="text-xs text-gray-600">Follow Up Date</label>
            {followUpDateFilterInput}
          </div>
        </div>
      </div>
      <select
        value={category ?? ""}
        onChange={(e) => setCategory(e.target.value)}
        className="input input-sm px-3 py-2 border border-neutral-55/60 focus:border-primary-10 transition duration-300 focus:outline-none rounded-md text-sm shadow-sm cursor-pointer"
      >
        <option value="">All Categories </option>
        {categories?.data?.map((category: any) => (
          <option key={category?.category} value={category?.category}>
            {category?.category}
          </option>
        ))}
      </select>
      <Category areaName="Lead" />
      <Button
        onClick={() => {
          setStatusFilter("");
          setPriorityFilter("");
          setCountryFilter("");
          setCityFilter("");
          setCategory("");
          setDiscoveryCallDateFilter("");
          setFollowUpDateFilter("");
        }}
        label={"Clear Filters"}
      />
      <Button
        onClick={() => {
          setModalType("add");
          setIsAddOrEditLeadModalOpen(true);
        }}
        label={"Add Lead"}
      />
    </>
  );

  return (
    <div>
      <Table<any>
        title="All Leads"
        description="Manage your leads, track follow-ups, and monitor progress"
        theads={leadTableHeaders}
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

      <Modal
        heading={"Schedule Discovery Call"}
        isModalOpen={isScheduleDiscoveryCallModalOpen}
        setIsModalOpen={setIsScheduleDiscoveryCallModalOpen}
      >
        <ScheduleDiscoveryCall
          existingData={selectedLead}
          onClose={() => setIsScheduleDiscoveryCallModalOpen(false)}
        />
      </Modal>

      <Modal
        heading={"Add Follow Up"}
        isModalOpen={isAddFollowUpModalOpen}
        setIsModalOpen={setIsAddFollowUpModalOpen}
      >
        <AddFollowUp
          leadId={selectedLeadId}
          onClose={() => setIsAddFollowUpModalOpen(false)}
        />
      </Modal>

      <Modal
        heading={"Follow Up History"}
        isModalOpen={isViewFollowUpsOpen}
        setIsModalOpen={setIsViewFollowUpsOpen}
      >
        <ViewFollowUps
          leadId={selectedLeadId}
          followUps={selectedLead?.followUps || []}
          onClose={() => setIsViewFollowUpsOpen(false)}
        />
      </Modal>

      <Modal
        heading={modalType === "add" ? "Add Lead" : "Edit Lead"}
        isModalOpen={isAddOrEditLeadModalOpen}
        setIsModalOpen={setIsAddOrEditLeadModalOpen}
      >
        <AddOrEditLead
          leadId={selectedLeadId}
          modalType={modalType}
          onClose={() => setIsAddOrEditLeadModalOpen(false)}
          categories={categories?.data}
        />
      </Modal>
    </div>
  );
};

export default Leads;
