/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import type { TableHead } from "../../../../components/Reusable/Table/Table";
import { FiEye, FiEdit2, FiTrash2, FiCalendar, FiUsers } from "react-icons/fi";
import Table from "../../../../components/Reusable/Table/Table";
import { formatDate } from "../../../../utils/formatDate";
import { useNavigate } from "react-router-dom";
import {
  useGetAllProjectsQuery,
  useDeleteProjectMutation,
} from "../../../../redux/Features/Project/projectApi";
import { toast } from "react-hot-toast";
import Modal from "../../../../components/Reusable/Modal/Modal";
import AddOrEditProject from "../../../../components/Dashboard/AdminPages/ProjectPage/AddOrEditProject/AddOrEditProject";
import Button from "../../../../components/Reusable/Button/Button";

const Projects = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const skip = (page - 1) * limit;
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [projectTypeFilter, setProjectTypeFilter] = useState<string>("");
  const [deleteProject] = useDeleteProjectMutation();

  const { data, isLoading, isFetching, refetch } = useGetAllProjectsQuery({
    page,
    limit,
    skip,
    keyword: searchQuery,
    status: statusFilter,
    projectType: projectTypeFilter,
  });

  const [modalType, setModalType] = useState<"add" | "edit">("add");
  const [selectedProjectId, setSelectedProjectId] = useState<any>(null);
  const [isAddOrEditProjectModalOpen, setIsAddOrEditProjectModalOpen] =
    useState<boolean>(false);
  // Status style mapping
  const statusStyles: Record<string, string> = {
    Ongoing: "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
    "On Hold": "bg-yellow-100 text-yellow-700",
    "Yet to Start": "bg-gray-100 text-gray-700",
  };

  // Project type style mapping
  const projectTypeStyles: Record<string, string> = {
    Frontend: "bg-purple-100 text-purple-700",
    Backend: "bg-indigo-100 text-indigo-700",
    "Full Stack Website": "bg-pink-100 text-pink-700",
    "Mobile App-Android": "bg-green-100 text-green-700",
    "Mobile App-iOS": "bg-gray-100 text-gray-700",
    "UI/UX Design": "bg-orange-100 text-orange-700",
    Redesign: "bg-yellow-100 text-yellow-700",
    Other: "bg-gray-100 text-gray-700",
  };

  // Table headers
  const projectTableHeaders: TableHead[] = [
    { key: "projectInfo", label: "Project Info" },
    { key: "clientInfo", label: "Client" },
    { key: "timeline", label: "Timeline" },
    { key: "financial", label: "Financial" },
    { key: "progress", label: "Progress" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Created Date" },
  ];

  const handleDeleteProject = async (
    projectId: string,
    projectName: string,
  ) => {
    if (window.confirm(`Are you sure you want to delete "${projectName}"?`)) {
      toast.promise(
        (async () => {
          const result = await deleteProject(projectId).unwrap();
          await refetch();
          return result;
        })(),
        {
          loading: "Deleting project...",
          success: "Project deleted successfully",
          error: (error: any) =>
            error?.data?.message || "Failed to delete project",
        },
      );
    }
  };

  // Calculate progress percentage based on phases
  const calculateProgress = (phases: string[], onGoingPhase: string) => {
    if (!phases || phases.length === 0) return 0;
    const currentPhaseIndex = phases.findIndex(
      (phase) => phase.toLowerCase() === onGoingPhase?.toLowerCase(),
    );
    if (currentPhaseIndex === -1) return 0;
    return Math.round(((currentPhaseIndex + 1) / phases.length) * 100);
  };

  // Get primary contact person
  const getPrimaryContact = (contactPersons: any[]) => {
    const primary = contactPersons?.find((contact) => contact.isPrimary);
    if (primary) {
      return `${primary.name} (${primary.countryCode} ${primary.phoneNumber})`;
    }
    if (contactPersons?.[0]) {
      return `${contactPersons[0].name} (${contactPersons[0].countryCode} ${contactPersons[0].phoneNumber})`;
    }
    return "N/A";
  };

  // Format currency
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format table data
  const tableData = data?.data?.data?.map((project: any) => ({
    ...project,
    _id: project._id,

    // Column: Project Info
    projectInfo: (
      <div className="space-y-1">
        <p className="font-semibold text-gray-800">{project.name}</p>
        <span
          className={`inline-block text-xs px-2 py-0.5 rounded ${projectTypeStyles[project.projectType]}`}
        >
          {project.projectType}
        </span>
        {project.description && (
          <p
            className="text-sm text-gray-500 truncate max-w-[200px]"
            title={project.description}
          >
            {project.description}
          </p>
        )}
      </div>
    ),

    // Column: Client Info
    clientInfo: (
      <div className="space-y-0.5">
        <p className="text-sm font-medium text-gray-800">
          {project.clientId?.name || "N/A"}
        </p>
        {project.contactPerson && project.contactPerson.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <FiUsers size={12} />
            <span>{getPrimaryContact(project.contactPerson)}</span>
          </div>
        )}
      </div>
    ),

    // Column: Timeline
    timeline: (
      <div className="space-y-1 text-sm">
        {project.startDate && (
          <div className="flex items-center gap-1">
            <FiCalendar size={12} className="text-gray-400" />
            <span className="text-gray-600">
              Start: {formatDate(project.startDate)}
            </span>
          </div>
        )}
        {project.endDate && (
          <div className="flex items-center gap-1">
            <FiCalendar size={12} className="text-gray-400" />
            <span className="text-gray-600">
              End: {formatDate(project.endDate)}
            </span>
          </div>
        )}
        {project.onGoingPhase && (
          <p className="text-xs text-primary-10 mt-1">
            Current Phase: {project.onGoingPhase}
          </p>
        )}
      </div>
    ),

    // Column: Financial
    financial: (
      <div className="space-y-1">
        <p className="font-semibold text-gray-800">
          {formatCurrency(project.price, project.priceCurrency)}
        </p>
        {project.dueAmount !== undefined && project.dueAmount > 0 && (
          <p className="text-sm text-red-600">
            Due: {formatCurrency(project.dueAmount, project.priceCurrency)}
          </p>
        )}
        {project.installments && project.installments.length > 0 && (
          <p className="text-xs text-gray-500">
            {project.installments.length} installment(s)
          </p>
        )}
      </div>
    ),

    // Column: Progress
    progress: (
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-gray-600">
          <span>Progress</span>
          <span>
            {calculateProgress(project.phases, project.onGoingPhase)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-10 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${calculateProgress(project.phases, project.onGoingPhase)}%`,
            }}
          />
        </div>
        {project.phases && project.phases.length > 0 && (
          <p className="text-xs text-gray-500">
            Phase{" "}
            {project.phases.findIndex(
              (phase: string) =>
                phase.toLowerCase() === project.onGoingPhase?.toLowerCase(),
            ) + 1}{" "}
            of {project.phases.length}
          </p>
        )}
      </div>
    ),

    // Column: Status
    status: (
      <span
        className={`capitalize px-2 py-1 rounded-xl text-sm font-medium inline-block ${
          statusStyles[project.status] || "bg-gray-100 text-gray-600"
        }`}
      >
        {project.status}
      </span>
    ),

    // Column: Created Date
    createdAt: formatDate(project.createdAt),
  }));

  // Actions
  const actions: any[] = [
    {
      label: "View Details",
      icon: <FiEye className="inline text-blue-600" />,
      onClick: (row: any) => {
        navigate(`/dashboard/admin/project/${row._id}`);
      },
    },
    {
      label: "Edit Project",
      icon: <FiEdit2 className="inline text-green-600" />,
      onClick: (row: any) => {
        setSelectedProjectId(row._id);
        setModalType("edit");
        setIsAddOrEditProjectModalOpen(true);
      },
    },
    {
      label: "Delete Project",
      icon: <FiTrash2 className="inline text-red-600" />,
      onClick: (row: any) => {
        handleDeleteProject(row._id, row.name);
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
      <option value="Ongoing">Ongoing</option>
      <option value="Completed">Completed</option>
      <option value="On Hold">On Hold</option>
      <option value="Yet to Start">Yet to Start</option>
    </select>
  );

  // Project type filter dropdown
  const projectTypeFilterDropdown = (
    <select
      value={projectTypeFilter}
      onChange={(e) => setProjectTypeFilter(e.target.value)}
      className="input input-sm px-3 py-2 border border-neutral-55/60 focus:border-primary-10 transition duration-300 focus:outline-none rounded-md text-sm shadow-sm cursor-pointer"
    >
      <option value="">All Types</option>
      <option value="Frontend">Frontend</option>
      <option value="Backend">Backend</option>
      <option value="Full Stack Website">Full Stack Website</option>
      <option value="Mobile App-Android">Mobile App-Android</option>
      <option value="Mobile App-iOS">Mobile App-iOS</option>
      <option value="UI/UX Design">UI/UX Design</option>
      <option value="Redesign">Redesign</option>
      <option value="Other">Other</option>
    </select>
  );

  // Combine filters
  const filters = (
    <div className="flex gap-2">
      {statusFilterDropdown}
      {projectTypeFilterDropdown}
      <Button
        onClick={() => {
          setModalType("add");
          setIsAddOrEditProjectModalOpen(true);
        }}
        label={"Add Project"}
        className="py-2 lg:py-2 px-3 lg:px-3 text-sm md:text-sm"
      />
    </div>
  );

  return (
    <div>
      <Table<any>
        title="All Projects"
        description="Manage your projects, track progress and monitor financials"
        theads={projectTableHeaders}
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
        heading={modalType === "add" ? "Add Project" : "Edit Project"}
        isModalOpen={isAddOrEditProjectModalOpen}
        setIsModalOpen={setIsAddOrEditProjectModalOpen}
      >
        <AddOrEditProject
          id={selectedProjectId}
          modalType={modalType}
          onClose={() => setIsAddOrEditProjectModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Projects;
