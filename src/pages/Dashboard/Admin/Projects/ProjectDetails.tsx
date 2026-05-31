/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useParams } from "react-router-dom";
import {
  useDeleteProjectMutation,
  useGetSingleProjectByIdQuery,
} from "../../../../redux/Features/Project/projectApi";
import {
  FiCalendar,
  FiDollarSign,
  FiUsers,
  FiLink,
  FiMessageSquare,
  FiClock,
  FiTag,
  FiBriefcase,
  FiCheckCircle,
  FiXCircle,
  FiLoader,
  FiPlus,
} from "react-icons/fi";
import { formatDate } from "../../../../utils/formatDate";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Button from "../../../../components/Reusable/Button/Button";
import Modal from "../../../../components/Reusable/Modal/Modal";
import AddExpenditure from "../../../../components/Dashboard/AdminPages/ProjectPage/AddExpenditure/AddExpenditure";
import { useState } from "react";
import AddPhaseInExpenditure from "../../../../components/Dashboard/AdminPages/ProjectPage/AddExpenditure/AddPhaseInExpenditure";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGetSingleProjectByIdQuery(id!);
  const [deleteProject] = useDeleteProjectMutation();
  const [isAddExpenditureModalOpen, setIsAddExpenditureModalOpen] =
    useState<boolean>(false);
  const [
    isAddPhaseInExpenditureModalOpen,
    setIsAddPhaseInExpenditureModalOpen,
  ] = useState<boolean>(false);
  const [selectedExpenditureId, setSelectedExpenditureId] = useState<string>("");

  const project = data?.data;
  console.log(project);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${project?.name}"?`)) {
      try {
        await deleteProject(id!).unwrap();
        toast.success("Project deleted successfully");
        navigate("/dashboard/admin/projects");
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to delete project");
      }
    }
  };

  // Status badge color
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Ongoing: "bg-blue-100 text-blue-700",
      Completed: "bg-green-100 text-green-700",
      "On Hold": "bg-yellow-100 text-yellow-700",
      "Yet to Start": "bg-gray-100 text-gray-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
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

  // Calculate progress
  //   const calculateProgress = () => {
  //   if (!project?.phases || project.phases.length === 0) return 0;

  //   // Find the index of the current phase by matching the name
  //   const currentPhaseIndex = project.phases.findIndex(
  //     (phase: any) => phase.name?.toLowerCase() === project.onGoingPhase?.toLowerCase()
  //   );

  //   if (currentPhaseIndex === -1) return 0;
  //   return Math.round(((currentPhaseIndex + 1) / project.phases.length) * 100);
  // };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-10"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Project not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 min-h-screen">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-800">
                {project.name}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  project.status,
                )}`}
              >
                {project.status}
              </span>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {project.projectType}
              </span>
            </div>
            {project.description && (
              <p className="text-gray-600 max-w-3xl">{project.description}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={handleDelete} variant="warning" label={"Delete"} />
            <Button
              onClick={() => setIsAddExpenditureModalOpen(true)}
              label={"Add Expenditure"}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Section */}
          {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiCheckCircle className="text-primary-10" />
              Project Progress
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Overall Progress</span>
                <span>{calculateProgress()}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-primary-10 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${calculateProgress()}%` }}
                />
              </div>
              {project.onGoingPhase && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Current Phase:</span>{" "}
                    {project.onGoingPhase}
                  </p>
                </div>
              )}
            </div>
          </div> */}

          {/* Phases Section */}
          {project.phases && project.phases.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiTag className="text-primary-10" />
                Project Phases
              </h2>
              <div className="space-y-2">
                {project.phases.map((phase: any, index: number) => {
                  // Check if phase is completed based on phaseStatus
                  const isCompleted = phase.phaseStatus === "Completed";
                  // Check if phase is current (ongoing)
                  const isCurrent = phase.name === project.onGoingPhase;
                  // Check if phase is pending or yet to start
                  const isPending =
                    phase.phaseStatus === "Pending" ||
                    phase.phaseStatus === "Yet to Start";

                  return (
                    <div
                      key={phase._id || index}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        isCurrent
                          ? "bg-blue-50 border border-blue-200"
                          : isCompleted
                            ? "bg-green-50 border border-green-200"
                            : isPending
                              ? "bg-yellow-50 border border-yellow-200"
                              : "bg-gray-50"
                      }`}
                    >
                      {/* Status Icon */}
                      {isCompleted ? (
                        <FiCheckCircle className="text-green-600" size={18} />
                      ) : isCurrent ? (
                        <FiLoader className="text-blue-600" size={18} />
                      ) : isPending ? (
                        <FiClock className="text-yellow-600" size={18} />
                      ) : (
                        <FiXCircle className="text-gray-400" size={18} />
                      )}

                      {/* Phase Name */}
                      <span
                        className={`flex-1 ${
                          isCurrent
                            ? "font-semibold text-gray-800"
                            : isCompleted
                              ? "text-gray-600"
                              : "text-gray-600"
                        }`}
                      >
                        {phase.name}
                      </span>

                      {/* Status Badges */}
                      <div className="flex items-center gap-2">
                        {isCurrent && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                            Current
                          </span>
                        )}
                        {isCompleted && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                            Completed
                          </span>
                        )}
                        {isPending && (
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                            Pending
                          </span>
                        )}

                        {/* Payment Status Badge */}
                        {phase.paymentStatus === "Paid" ? (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                            Paid
                          </span>
                        ) : (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                            Payment Pending
                          </span>
                        )}

                        {/* Amount */}
                        {phase.totalAmount > 0 && (
                          <span className="text-xs font-medium text-gray-600">
                            ৳ {phase.totalAmount.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Installments Section */}
          {project.installments && project.installments.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiDollarSign className="text-primary-10" />
                Payment Installments
              </h2>
              <div className="space-y-3">
                {project.installments.map((installment: any, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        Installment {index + 1}
                      </p>
                      <p className="text-sm text-gray-500">
                        Due: {formatDate(installment.date)}
                      </p>
                      {installment.paymentMethod && (
                        <p className="text-xs text-gray-500">
                          Method: {installment.paymentMethod}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">
                        {formatCurrency(
                          installment.amount,
                          project.priceCurrency,
                        )}
                      </p>
                      {installment.receiver && (
                        <p className="text-xs text-gray-500">
                          To: {installment.receiver}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Expenditures Section */}
          {project.expenditures && project.expenditures.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FiDollarSign className="text-primary-10" />
                  Expenditures
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    {project.expenditures.length}
                  </span>
                </h2>
                <button
                  onClick={() => {
                    // Open modal to add new expenditure
                    setIsAddExpenditureModalOpen(true);
                  }}
                  className="flex items-center gap-1 text-sm bg-primary-10 text-white px-3 py-1.5 rounded-lg hover:bg-primary-20 transition"
                >
                  <FiPlus size={14} />
                  Add Expenditure
                </button>
              </div>

              <div className="space-y-4">
                {project.expenditures.map(
                  (expenditure: any, expIndex: number) => (
                    <div
                      key={expenditure._id || expIndex}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      {/* Expenditure Header */}
                      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {expenditure.description}
                          </h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-gray-500">
                              Total:{" "}
                              <span className="font-medium text-gray-700">
                                {formatCurrency(
                                  expenditure.totalAmount,
                                  project.priceCurrency,
                                )}
                              </span>
                            </span>
                            <span className="text-xs text-gray-500">
                              Pending:{" "}
                              <span className="font-medium text-red-600">
                                {formatCurrency(
                                  expenditure.pendingAmount,
                                  project.priceCurrency,
                                )}
                              </span>
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedExpenditureId(expenditure._id);
                            setIsAddPhaseInExpenditureModalOpen(true);
                          }}
                          className="flex items-center gap-1 text-xs text-primary-10 hover:text-primary-20 border border-primary-10 px-2 py-1 rounded-lg hover:bg-primary-10/5 transition"
                        >
                          <FiPlus size={12} />
                          Add Phase
                        </button>
                      </div>

                      {/* Phases List */}
                      {expenditure.phases && expenditure.phases.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                          {expenditure.phases.map(
                            (phase: any, phaseIndex: number) => (
                              <div
                                key={phase._id || phaseIndex}
                                className="px-4 py-3 hover:bg-gray-50 transition"
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <p className="font-medium text-gray-800">
                                        {phase.title}
                                      </p>
                                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                        {phase.currency}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                      <span>
                                        Paid:{" "}
                                        {formatCurrency(
                                          phase.paidAmount,
                                          phase.currency,
                                        )}
                                      </span>
                                      <span>
                                        Date: {formatDate(phase.date)}
                                      </span>
                                      <span>Method: {phase.paymentMethod}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      ) : (
                        <div className="px-4 py-6 text-center text-gray-500">
                          <FiDollarSign
                            className="mx-auto text-gray-300 mb-2"
                            size={24}
                          />
                          <p className="text-sm">No phases added yet</p>
                          <button
                            // onClick={() => {
                            //   setSelectedExpenditureId(expenditure._id);
                            //   setIsAddPhaseModalOpen(true);
                            // }}
                            className="mt-2 text-xs text-primary-10 hover:underline"
                          >
                            Add your first phase
                          </button>
                        </div>
                      )}
                    </div>
                  ),
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - 1 column */}
        <div className="space-y-6">
          {/* Client Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiBriefcase className="text-primary-10" />
              Client Information
            </h2>
            <div className="space-y-2">
              <Link
                to={`/dashboard/admin/client/${project.clientId?._id}`}
                className="font-medium text-primary-10 underline"
              >
                {project.clientId?.name || "N/A"}
              </Link>
            </div>
          </div>

          {/* Contact Persons */}
          {project.contactPerson && project.contactPerson.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiUsers className="text-primary-10" />
                Contact Persons
              </h2>
              <div className="space-y-3">
                {project.contactPerson.map((contact: any, index: number) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 rounded-lg space-y-1"
                  >
                    <p className="font-medium text-gray-800">
                      {contact.name}
                      {contact.isPrimary && (
                        <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                          Primary
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-600">
                      {contact.countryCode} {contact.phoneNumber}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Financial Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiDollarSign className="text-primary-10" />
              Financial Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Total Price</span>
                <span className="font-semibold text-gray-800">
                  {formatCurrency(project.price, project.priceCurrency)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Due Amount</span>
                <span className="font-semibold text-red-600">
                  {formatCurrency(project.dueAmount, project.priceCurrency)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Paid Amount</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(
                    project.price - project.dueAmount,
                    project.priceCurrency,
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiCalendar className="text-primary-10" />
              Timeline
            </h2>
            <div className="space-y-2">
              {project.startDate && (
                <div>
                  <p className="text-xs text-gray-500">Start Date</p>
                  <p className="text-gray-800">
                    {formatDate(project.startDate)}
                  </p>
                </div>
              )}
              {project.endDate && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500">End Date</p>
                  <p className="text-gray-800">{formatDate(project.endDate)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Timeline Link */}
          {project.timelineLink && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiLink className="text-primary-10" />
                Project Links
              </h2>
              {project?.projectLinks?.map((link: string) => (
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-10 hover:underline break-all"
                >
                  {link}
                </a>
              ))}
            </div>
          )}

          {/* Notes */}
          {project.notes && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiMessageSquare className="text-primary-10" />
                Notes
              </h2>
              <p className="text-gray-600 whitespace-pre-wrap">
                {project.notes}
              </p>
            </div>
          )}

          {/* Metadata */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiClock className="text-primary-10" />
              Metadata
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Created At</span>
                <span className="text-gray-800">
                  {formatDate(project.createdAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated</span>
                <span className="text-gray-800">
                  {formatDate(project.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Expenditure Modal */}
      <Modal
        heading={"Add Expenditure"}
        isModalOpen={isAddExpenditureModalOpen}
        setIsModalOpen={setIsAddExpenditureModalOpen}
      >
        <AddExpenditure
          projectId={id as string}
          onClose={() => setIsAddExpenditureModalOpen(false)}
        />
      </Modal>

      {/* Add Phase to Expenditure Modal */}
      <Modal
        heading="Add Phase to Expenditure"
        isModalOpen={isAddPhaseInExpenditureModalOpen}
        setIsModalOpen={setIsAddPhaseInExpenditureModalOpen}
      >
        <AddPhaseInExpenditure
          projectId={id as string}
          expenditureId={selectedExpenditureId!}
          onClose={() => {
            setIsAddPhaseInExpenditureModalOpen(false);
          }}
        />
      </Modal>
    </div>
  );
};

export default ProjectDetails;
