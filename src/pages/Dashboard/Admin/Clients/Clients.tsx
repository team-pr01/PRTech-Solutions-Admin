/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import type { TableHead } from "../../../../components/Reusable/Table/Table";
import { FiEye, FiTrash2 } from "react-icons/fi";
import Table from "../../../../components/Reusable/Table/Table";
import { formatDate } from "../../../../utils/formatDate";
import { useNavigate } from "react-router-dom";
import {
  useDeleteClientMutation,
  useGetAllClientsQuery,
} from "../../../../redux/Features/Client/clientApi";
import Button from "../../../../components/Reusable/Button/Button";
import Modal from "../../../../components/Reusable/Modal/Modal";
import AddOrEditClient from "../../../../components/Dashboard/AdminPages/ClientPage/AddOrEditClient/AddOrEditClient";
import { BiPencil } from "react-icons/bi";
import { toast } from "react-hot-toast";

const Clients = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const skip = (page - 1) * limit;
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [sourceFilter, setSourceFilter] = useState<string>("");

  const { data, isLoading, isFetching } = useGetAllClientsQuery({
    page,
    limit,
    skip,
    keyword: searchQuery,
    status: statusFilter,
    source: sourceFilter,
  });
  const [deleteClient] = useDeleteClientMutation();

  const [modalType, setModalType] = useState<"add" | "edit">("add");
  const [selectedClientId, setSelectedClientId] = useState<any>(null);
  const [isAddOrEditClientModalOpen, setIsAddOrEditClientModalOpen] =
    useState<boolean>(false);

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
      label: "Edit",
      icon: <BiPencil className="inline" />,
      onClick: (row: any) => {
        setSelectedClientId(row._id);
        setModalType("edit");
        setIsAddOrEditClientModalOpen(true);
      },
    },
    {
      label: "Delete",
      icon: <FiTrash2 className="inline" />,
      onClick: (row: any) => {
        handleDeleteClient(row._id);
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

  const handleDeleteClient = async (id: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      toast.promise(
        (async () => {
          const result = await deleteClient(id).unwrap();
          return result;
        })(),
        {
          loading: `Deleting client "${name}"...`,
          success: `Client "${name}" deleted successfully`,
          error: (error: any) =>
            error?.data?.message || error?.message || "Failed to delete client",
        },
      );
    }
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
      <Button
        onClick={() => {
          setModalType("add");
          setIsAddOrEditClientModalOpen(true);
        }}
        label={"Add Client"}
        className="py-2 lg:py-2 px-3 lg:px-3 text-sm md:text-sm"
      />
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

      <Modal
        heading={modalType === "add" ? "Add Client" : "Edit Client"}
        isModalOpen={isAddOrEditClientModalOpen}
        setIsModalOpen={setIsAddOrEditClientModalOpen}
      >
        <AddOrEditClient
          clientId={selectedClientId}
          modalType={modalType}
          onClose={() => setIsAddOrEditClientModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Clients;
