/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  FiEdit2,
  FiTrash2,
  FiCalendar,
  FiDollarSign,
  FiTrendingDown,
  FiCheckCircle,
  FiClock,
  FiEye,
  FiPlus,
} from "react-icons/fi";
import Drawer from "../../../../Reusable/Drawer/Drawer";
import { formatDate } from "../../../../../utils/formatDate";
import AddOrEditPhase from "../AddOrEditPhase/AddOrEditPhase";
import {
  useGetAllPhasesQuery,
  useDeletePhaseMutation,
} from "../../../../../redux/Features/Project/projectApi";
import { toast } from "react-hot-toast";
import { formatCurrency } from "../../../../../utils/formatCurrency";
import Installments from "./Installments";
import {
  getPaymentStatusColor,
  getPhaseStatusColor,
} from "../../../../../utils/project.utils";
import AddInstallmentForm from "./AddInstallmentForm";
type TInstallment = {
  _id?: string;
  amount: number;
  date: Date;
  paymentMethod?: string;
  receiver?: string;
  note?: string;
};

export type TPhase = {
  _id?: string;
  name: string;
  phaseStatus: "Pending" | "Yet to Start" | "Ongoing" | "On Hold" | "Completed";
  totalAmount: number;
  pendingAmount: number;
  paymentStatus: "Pending" | "Paid";
  installments: TInstallment[];
  startDate: Date;
  endDate?: Date;
};

type PhaseDetailsProps = {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  onRefresh?: () => void;
};

const PhaseDetails = ({
  isOpen,
  onClose,
  projectId,
  onRefresh,
}: PhaseDetailsProps) => {
  const [expandedPhaseId, setExpandedPhaseId] = useState<string | null>(null);

  const handleViewPhase = (phase: TPhase) => {
    setExpandedPhaseId(
      expandedPhaseId === phase._id ? null : (phase._id ?? null),
    );
  };
  const { data, isLoading, refetch } = useGetAllPhasesQuery(projectId);
  const [deletePhase] = useDeletePhaseMutation();

  const [selectedPhase, setSelectedPhase] = useState<TPhase | null>(null);
  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isAddInstallmentDrawerOpen, setIsAddInstallmentDrawerOpen] =
    useState<boolean>(false);

  const phases = data?.data || [];

  const handleDeletePhase = async (phase: TPhase) => {
    if (
      window.confirm(`Are you sure you want to delete phase "${phase.name}"?`)
    ) {
      toast.promise(
        (async () => {
          await deletePhase({ projectId, phaseId: phase._id! }).unwrap();
          await refetch();
          onRefresh?.();
        })(),
        {
          loading: "Deleting phase...",
          success: "Phase deleted successfully",
          error: (error: any) =>
            error?.data?.message || "Failed to delete phase",
        },
      );
    }
  };

  const handleEditPhase = (phase: TPhase) => {
    setSelectedPhase(phase);
    setShowEditModal(true);
  };

  if (isLoading) {
    return (
      <Drawer
        heading="Project Phases"
        isDrawerOpen={isOpen}
        setIsDrawerOpen={onClose}
        position="right"
        width="w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[30%]"
      >
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-10"></div>
        </div>
      </Drawer>
    );
  }

  return (
    <>
      <Drawer
        heading={`Project Phases (${phases.length})`}
        isDrawerOpen={isOpen}
        setIsDrawerOpen={onClose}
        position="right"
        width="w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[30%]"
      >
        <div className="space-y-4">
          {phases.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <FiClock className="mx-auto text-4xl text-gray-400 mb-3" />
              <p className="text-gray-500">No phases added yet</p>
            </div>
          ) : (
            phases.map((phase: TPhase, index: number) => (
              <div
                key={phase._id || index}
                className="border border-gray-200 rounded-lg p-4 transition-all duration-200 bg-white w-full"
              >
                {/* Phase Header */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    {/* Phase info */}
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <h3 className="font-semibold text-gray-800 text-lg">
                        {phase.name}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPhaseStatusColor(phase.phaseStatus)}`}
                      >
                        Status: {phase.phaseStatus}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(phase.paymentStatus)}`}
                      >
                        Payment: {phase.paymentStatus}
                      </span>
                    </div>

                    {/* Timeline */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                      <div className="flex items-center gap-1">
                        <FiCalendar size={12} />
                        <span>Start: {formatDate(phase.startDate as any)}</span>
                      </div>
                      {phase.endDate && (
                        <div className="flex items-center gap-1">
                          <FiCalendar size={12} />
                          <span>End: {formatDate(phase.endDate as any)}</span>
                        </div>
                      )}
                    </div>

                    {/* Financial Info */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex gap-2">
                        <FiDollarSign size={14} className="text-green-600 mt-1" />
                        <span className="text-gray-700">
                          Total: {formatCurrency(phase.totalAmount)}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <FiTrendingDown size={14} className="text-orange-600 mt-1" />
                        <span className="text-gray-700">
                          Pending: {formatCurrency(phase.pendingAmount)}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <FiCheckCircle size={14} className="text-blue-600 mt-1" />
                        <span className="text-gray-700">
                          Paid:{" "}
                          {formatCurrency(
                            phase.totalAmount - phase.pendingAmount,
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Installments Count */}
                      {phase.installments && phase.installments.length > 0 && (
                        <div className="text-xs text-gray-500">
                          <FiClock className="inline mr-1" size={12} />
                          {phase.installments.length} installment(s) received
                        </div>
                      )}

                      <button
                        onClick={() => {
                          setSelectedPhaseId(phase?._id as string);
                          setIsAddInstallmentDrawerOpen(true);
                        }}
                        className="text-xs text-primary-10 underline flex items-center gap-1"
                      >
                        <FiPlus /> Add Installment
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleViewPhase(phase)}
                      className={`p-2 transition-colors rounded-lg ${
                        expandedPhaseId === phase._id
                          ? "text-primary-10 bg-primary-10/10"
                          : "text-blue-600 hover:bg-blue-50"
                      }`}
                      title={
                        expandedPhaseId === phase._id
                          ? "Hide Installments"
                          : "View Installments"
                      }
                    >
                      <FiEye size={18} />
                    </button>
                    <button
                      onClick={() => handleEditPhase(phase)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Edit Phase"
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDeletePhase(phase)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Phase"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Accordion Installments Section */}
                <Installments expandedPhaseId={expandedPhaseId} phase={phase} />
              </div>
            ))
          )}
        </div>
      </Drawer>

      {/* Edit Phase Drawer */}
      {showEditModal && selectedPhase && (
        <Drawer
          heading={`Edit Phase: ${selectedPhase.name}`}
          isDrawerOpen={showEditModal}
          setIsDrawerOpen={setShowEditModal}
          position="left"
        >
          <AddOrEditPhase
            projectId={projectId}
            phaseId={selectedPhase._id}
            modalType="edit"
            onClose={() => {
              setShowEditModal(false);
              setSelectedPhase(null);
            }}
            onSuccess={() => {
              setShowEditModal(false);
              setSelectedPhase(null);
              refetch();
              onRefresh?.();
            }}
          />
        </Drawer>
      )}

      {/* Add installment Drawer */}
      {isAddInstallmentDrawerOpen && (
        <Drawer
          heading={`Add Installment`}
          isDrawerOpen={isAddInstallmentDrawerOpen}
          setIsDrawerOpen={setIsAddInstallmentDrawerOpen}
          position="left"
        >
          <AddInstallmentForm
            projectId={projectId}
            phaseId={selectedPhaseId as string}
            setIsAddInstallmentDrawerOpen={setIsAddInstallmentDrawerOpen}
          />
        </Drawer>
      )}
    </>
  );
};

export default PhaseDetails;
