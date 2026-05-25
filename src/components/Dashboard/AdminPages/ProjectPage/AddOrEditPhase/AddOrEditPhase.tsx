/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import TextInput from "../../../../Reusable/TextInput/TextInput";
import SelectDropdown from "../../../../Reusable/SelectDropdown/SelectDropdown";
import Textarea from "../../../../Reusable/TextArea/TextArea";
import Button from "../../../../Reusable/Button/Button";
import {
  useAddPhaseMutation,
  useUpdatePhaseMutation,
  useGetSinglePhaseByIdQuery,
} from "../../../../../redux/Features/Project/projectApi";

type TInstallment = {
  amount: number;
  date: string;
  paymentMethod?: "Cash" | "Bank Transfer" | "Credit Card" | "PayPal" | "bKash" | "Nagad" | "PhonePe" | "Google Pay" | "Payoneer" | "Other";
  receiver?: string;
  note?: string;
};

type PhaseFormData = {
  name: string;
  phaseStatus: "Pending" | "Yet to Start" | "Ongoing" | "On Hold" | "Completed";
  totalAmount: number;
  pendingAmount: number;
  paymentStatus: "Pending" | "Paid";
  installments: TInstallment[];
  startDate: string;
  endDate?: string;
  notes?: string;
};

type AddOrEditPhaseProps = {
  projectId: string;
  phaseId?: string;
  modalType: "add" | "edit";
  onClose: () => void;
  onSuccess?: () => void;
};

const AddOrEditPhase = ({
  projectId,
  phaseId,
  modalType,
  onClose,
  onSuccess,
}: AddOrEditPhaseProps) => {
  const { data: phaseData, isLoading: isLoadingPhase } = useGetSinglePhaseByIdQuery(
    { projectId, phaseId: phaseId! },
    { skip: modalType !== "edit" || !phaseId }
  );

  const [addPhase] = useAddPhaseMutation();
  const [updatePhase] = useUpdatePhaseMutation();
  

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<PhaseFormData>({
    defaultValues: {
      name: "",
      phaseStatus: "Pending",
      totalAmount: 0,
      pendingAmount: 0,
      paymentStatus: "Pending",
      installments: [],
      startDate: "",
      endDate: "",
      notes: "",
    },
  });

  const watchTotalAmount = watch("totalAmount");
  const watchInstallments = watch("installments");

  // Auto-calculate pending amount when total amount or installments change
  useEffect(() => {
    if (watchTotalAmount && watchInstallments?.length > 0) {
      const totalPaid = watchInstallments.reduce(
        (sum, inst) => sum + (inst?.amount || 0),
        0
      );
      const newPendingAmount = watchTotalAmount - totalPaid;
      setValue("pendingAmount", newPendingAmount >= 0 ? newPendingAmount : 0);
      setValue(
        "paymentStatus",
        newPendingAmount <= 0 ? "Paid" : "Pending"
      );
    } else if (watchTotalAmount) {
      setValue("pendingAmount", watchTotalAmount);
    }
  }, [watchTotalAmount, watchInstallments, setValue]);

  // Options for dropdowns
  const phaseStatusOptions = [
    "Pending",
    "Yet to Start",
    "Ongoing",
    "On Hold",
    "Completed",
  ];

  const paymentStatusOptions = ["Pending", "Paid"];

  // Set default values when editing
  useEffect(() => {
    if (modalType === "edit" && phaseData?.data) {
      const phase = phaseData.data;
      reset({
        name: phase.name || "",
        phaseStatus: phase.phaseStatus || "Pending",
        totalAmount: phase.totalAmount || 0,
        pendingAmount: phase.pendingAmount || 0,
        paymentStatus: phase.paymentStatus || "Pending",
        installments: phase.installments?.map((inst: any) => ({
          amount: inst.amount,
          date: inst.date ? inst.date.split("T")[0] : "",
          paymentMethod: inst.paymentMethod,
          receiver: inst.receiver,
          note: inst.note,
        })) || [],
        startDate: phase.startDate ? phase.startDate.split("T")[0] : "",
        endDate: phase.endDate ? phase.endDate.split("T")[0] : "",
        notes: phase.notes || "",
      });
    }
  }, [modalType, phaseData, reset]);

  const handleSubmitPhase = async (data: PhaseFormData) => {
    try {
      // Convert date strings to ISO format
      const payload = {
        ...data,
        totalAmount: Number(data.totalAmount),
        pendingAmount: Number(data.pendingAmount),
        startDate: data.startDate ? new Date(data.startDate).toISOString() : undefined,
        endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
        installments: data.installments.map((inst) => ({
          ...inst,
          amount: Number(inst.amount),
          date: inst.date ? new Date(inst.date).toISOString() : undefined,
        })),
      };

      if (modalType === "add") {
        const result = await addPhase({
          projectId,
          data: payload,
        }).unwrap();
        
        if (result.success) {
          toast.success("Phase added successfully");
          reset();
          onSuccess?.();
          onClose();
        }
      } else {
        const result = await updatePhase({
          projectId,
          phaseId: phaseId!,
          data: payload,
        }).unwrap();
        
        if (result.success) {
          toast.success("Phase updated successfully");
          onSuccess?.();
          onClose();
        }
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          `Failed to ${modalType === "add" ? "add" : "update"} phase`
      );
    }
  };

  if (modalType === "edit" && isLoadingPhase) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-10"></div>
      </div>
    );
  }

  return (
    <div className="mt-5">
      <form onSubmit={handleSubmit(handleSubmitPhase)} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
            Basic Information
          </h3>

          <TextInput
            label="Phase Name"
            placeholder="Enter phase name"
            error={errors.name}
            {...register("name", {
              required: "Phase name is required",
            })}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectDropdown
              label="Phase Status"
              options={phaseStatusOptions}
              error={errors.phaseStatus}
              {...register("phaseStatus")}
            />

            <SelectDropdown
              label="Payment Status"
              options={paymentStatusOptions}
              error={errors.paymentStatus}
              {...register("paymentStatus")}
            />
          </div>
        </div>

        {/* Dates Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
            Timeline
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Start Date"
              type="date"
              error={errors.startDate}
              {...register("startDate", {
                required: "Start date is required",
              })}
            />

            <TextInput
              label="End Date"
              type="date"
              error={errors.endDate}
              {...register("endDate")}
              isRequired={false}
            />
          </div>
        </div>

        {/* Financial Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
            Financial Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Total Amount"
              type="number"
              placeholder="Enter total amount"
              error={errors.totalAmount}
              {...register("totalAmount", {
                required: "Total amount is required",
                min: { value: 0, message: "Amount must be positive" },
                valueAsNumber: true,
              })}
            />

            <TextInput
              label="Pending Amount"
              type="number"
              placeholder="Auto-calculated"
              error={errors.pendingAmount}
              {...register("pendingAmount", {
                valueAsNumber: true,
              })}
              isDisabled={true}
              isRequired={false}
            />
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Note:</span> Pending amount is auto-calculated as Total Amount - Sum of Installments.
            </p>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
            Additional Information
          </h3>

          <Textarea
            label="Notes"
            placeholder="Enter any notes about this phase..."
            {...register("notes")}
            isRequired={false}
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            onClick={onClose}
            variant="secondary"
            label="Cancel"
          />
          <Button
            type="submit"
            isDisabled={isSubmitting}
            label={
              isSubmitting
                ? modalType === "add"
                  ? "Adding..."
                  : "Updating..."
                : modalType === "add"
                ? "Add Phase"
                : "Update Phase"
            }
          />
        </div>
      </form>
    </div>
  );
};

export default AddOrEditPhase;