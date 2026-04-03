/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import type { TableHead } from "../../../../components/Reusable/Table/Table";
import { FiEye, FiUserPlus, FiUsers } from "react-icons/fi";
import Table from "../../../../components/Reusable/Table/Table";
import { formatDate } from "../../../../utils/formatDate";
import { useNavigate } from "react-router-dom";
import { useGetAllClientsQuery } from "../../../../redux/Features/Client/clientApi";

const Clients = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [sourceFilter, setSourceFilter] = useState<string>("");

  const { data, isLoading, isFetching } = useGetAllClientsQuery({
    page,
    limit,
    keyword: searchQuery,
    status: statusFilter,
    source: sourceFilter,
  });

  // Table headers
  const clientTableHeaders: TableHead[] = [
    { key: "clientInfo", label: "Client Info" },
    { key: "primaryContact", label: "Primary Contact" },
    { key: "businessInfo", label: "Business Info" },
    { key: "source", label: "Source" },
    { key: "createdAt", label: "Created Date" },
  ];

  // Actions
  const actions: any[] = [
    {
      label: "View Details",
      icon: <FiEye className="inline text-blue-600" />,
      onClick: (row: any) => {
        navigate(`/dashboard/admin/client/${row._id}`);
      },
    },
    {
      label: "Add Subordinate",
      icon: <FiUserPlus className="inline text-green-600" />,
      onClick: (row: any) => {
        navigate(`/dashboard/admin/clients/${row._id}/add-subordinate`);
      },
    },
    {
      label: "View Subordinates",
      icon: <FiUsers className="inline text-purple-600" />,
      onClick: (row: any) => {
        navigate(`/dashboard/admin/clients/${row._id}/subordinates`);
      },
    },
  ];

  // Get primary email
  const getPrimaryEmail = (emails: any[]) => {
    const primary = emails?.find((email) => email.isPrimary);
    return primary?.email || emails?.[0]?.email || "N/A";
  };

  // Get primary phone number
  const getPrimaryPhone = (phoneNumbers: any[]) => {
    const primary = phoneNumbers?.find((phone) => phone.isPrimary);
    if (primary) {
      return `${primary.countryCode} ${primary.phoneNumber}`;
    }
    return phoneNumbers?.[0]
      ? `${phoneNumbers[0].countryCode} ${phoneNumbers[0].phoneNumber}`
      : "N/A";
  };

  // Format table data
  const tableData = data?.data?.data?.map((client: any) => ({
    ...client,
    _id: client._id,

    // Column: Client Info
    clientInfo: (
      <div className="space-y-0.5">
        <p className="font-semibold text-gray-800">
          {client.name || "N/A"}
          <span className="text-primary-10 text-sm ml-2">
            ({client.clientId || "N/A"})
          </span>
        </p>
        {client.industry && (
          <p className="text-sm text-gray-500">Industry: {client.industry}</p>
        )}
        {client.companySize && client.companySize !== "unknown" && (
          <p className="text-sm text-gray-500">
            Size: {client.companySize} employees
          </p>
        )}
      </div>
    ),

    // Column: Primary Contact
    primaryContact: (
      <div className="space-y-0.5">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Email:</span>{" "}
          {getPrimaryEmail(client.emails)}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Phone:</span>{" "}
          {getPrimaryPhone(client.phoneNumbers)}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Preferred Contact Method:</span>{" "}
          <span className="capitalize">
            {client.preferredContactMethod || "N/A"}
          </span>
        </p>
      </div>
    ),

    // Column: Business Info
    businessInfo: (
      <div className="space-y-0.5">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Country:</span>{" "}
          {client.country || "N/A"}
        </p>
        {client.address && (
          <p
            className="text-sm text-gray-600 truncate max-w-[200px]"
            title={client.address}
          >
            <span className="font-medium">Address:</span> {client.address}
          </p>
        )}
        {client.subordinates && client.subordinates.length > 0 && (
          <p className="text-sm text-purple-600">
            <span className="font-medium">Subordinates:</span>{" "}
            {client.subordinates.length}
          </p>
        )}
      </div>
    ),

    // Column: Source
    source: (
      <span className="capitalize px-2 py-1 rounded-xl text-xs font-medium bg-gray-100 text-gray-700">
        {client.source?.replace(/_/g, " ") || "N/A"}
      </span>
    ),

    // Column: Created Date
    createdAt: formatDate(client.createdAt),
  }));

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
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
      <option value="lead">Lead</option>
      <option value="negotiation">Negotiation</option>
      <option value="former">Former</option>
    </select>
  );

  // Source filter dropdown
  const sourceFilterDropdown = (
    <select
      value={sourceFilter}
      onChange={(e) => setSourceFilter(e.target.value)}
      className="input input-sm px-3 py-2 border border-neutral-55/60 focus:border-primary-10 transition duration-300 focus:outline-none rounded-md text-sm shadow-sm cursor-pointer"
    >
      <option value="">All Sources</option>
      <option value="referral">Referral</option>
      <option value="website">Website</option>
      <option value="cold_call">Cold Call</option>
      <option value="conference">Conference</option>
      <option value="social_media">Social Media</option>
      <option value="other">Other</option>
    </select>
  );

  // Combine filters
  const filters = (
    <div className="flex gap-2">
      {statusFilterDropdown}
      {sourceFilterDropdown}
    </div>
  );

  return (
    <div>
      <Table<any>
        title="All Clients"
        description="Manage your clients, view their information, and add subordinates"
        theads={clientTableHeaders}
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

export default Clients;
