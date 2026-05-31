/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import TextInput from "../../../../Reusable/TextInput/TextInput";
import SelectDropdown from "../../../../Reusable/SelectDropdown/SelectDropdown";
import {
  useAddProjectMutation,
  useUpdateProjectMutation,
  useGetSingleProjectByIdQuery,
} from "../../../../../redux/Features/Project/projectApi";
import {
  useGetAllClientsQuery,
} from "../../../../../redux/Features/Client/clientApi";
import Textarea from "../../../../Reusable/TextArea/TextArea";

type Installment = {
  amount: number;
  date: string;
  paymentMethod?:
    | "Cash"
    | "Bank Transfer"
    | "Credit Card"
    | "PayPal"
    | "bKash"
    | "Nagad"
    | "PhonePe"
    | "Google Pay"
    | "Payoneer"
    | "Other";
  receiver?: string;
  note?: string;
};

type Phase = {
  name: string;
  phaseStatus: "Pending" | "Yet to Start" | "Ongoing" | "On Hold" | "Completed";
  totalAmount: number;
  pendingAmount: number;
  paymentStatus: "Pending" | "Paid";
  installments: Installment[];
};

type ProjectFormData = {
  name: string;
  projectType: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  deadline?: string;
  status: "Ongoing" | "Completed" | "On Hold" | "Yet to Start";
  priceCurrency: string;
  phases: Phase[];
  onGoingPhase?: string;
  timelineLink?: string;
  notes?: string;
  clientId: string;
};

type AddOrEditProjectProps = {
  id?: string;
  modalType: "add" | "edit";
  onClose: () => void;
  onSuccess?: () => void;
};

const AddOrEditProject = ({
  id,
  modalType,
  onClose,
  onSuccess,
}: AddOrEditProjectProps) => {
  const { data: projectData, isLoading: isLoadingProject } =
    useGetSingleProjectByIdQuery(id!, { skip: modalType !== "edit" || !id });

  const { data: clientsData } = useGetAllClientsQuery({ limit: 100, page: 1 });

  // const { data } = useGetSubordinatesClientByIdQuery(selectedCLientId!);
  // const subordinates = data?.data || [];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProjectFormData>({
    defaultValues: {
      name: "",
      projectType: "",
      description: "",
      startDate: "",
      endDate: "",
      deadline: "",
      status: "Yet to Start",
      priceCurrency: "",
      phases: [],
      onGoingPhase: "",
      timelineLink: "",
      notes: "",
      clientId: "",
    },
  });

  const [addProject] = useAddProjectMutation();
  const [updateProject] = useUpdateProjectMutation();

  const statusOptions = ["Yet to Start", "Ongoing", "On Hold", "Completed"];

  const currencyOptions = ["BDT", "INR", "USD", "Other"];

  // Set default values when editing
  useEffect(() => {
    if (modalType === "edit" && projectData?.data) {
      const project = projectData.data;
      reset({
        name: project.name || "",
        projectType: project.projectType || "Frontend",
        description: project.description || "",
        startDate: project.startDate ? project.startDate.split("T")[0] : "",
        endDate: project.endDate ? project.endDate.split("T")[0] : "",
        deadline: project.deadline || "",
        status: project.status || "Yet to Start",
        priceCurrency: project.priceCurrency || "USD",
        phases:
          project.phases?.map((phase: any) => ({
            name: phase.name,
            phaseStatus: phase.phaseStatus || "Pending",
            totalAmount: phase.totalAmount || 0,
            pendingAmount: phase.pendingAmount || 0,
            paymentStatus: phase.paymentStatus || "Pending",
            installments:
              phase.installments?.map((inst: any) => ({
                amount: inst.amount,
                date: inst.date ? inst.date.split("T")[0] : "",
                paymentMethod: inst.paymentMethod,
                receiver: inst.receiver,
                note: inst.note,
              })) || [],
          })) || [],
        onGoingPhase: project.onGoingPhase || "",
        timelineLink: project.timelineLink || "",
        notes: project.notes || "",
        clientId: project.clientId?._id || project.clientId || "",
      });
    }
  }, [modalType, projectData, reset]);

  const handleSubmitProject = async (data: ProjectFormData) => {
    try {

      // Convert date strings to ISO format
      const payload = {
        ...data,
        startDate: data.startDate
          ? new Date(data.startDate).toISOString()
          : undefined,
        endDate: data.endDate
          ? new Date(data.endDate).toISOString()
          : undefined,
        phases: data.phases.map((phase) => ({
          ...phase,
          installments:
            phase.installments?.map((inst) => ({
              ...inst,
              date: inst.date ? new Date(inst.date).toISOString() : undefined,
            })) || [],
        })),
      };

      if (modalType === "add") {
        const result = await addProject(payload).unwrap();
        if (result.success) {
          toast.success("Project added successfully");
          reset();
          onSuccess?.();
          onClose();
        }
      } else {
        const result = await updateProject({
          id: id!,
          data: payload,
        }).unwrap();
        if (result.success) {
          toast.success("Project updated successfully");
          onSuccess?.();
          onClose();
        }
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          `Failed to ${modalType === "add" ? "add" : "update"} project`,
      );
    }
  };

  if (modalType === "edit" && isLoadingProject) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-10"></div>
      </div>
    );
  }

  return (
    <div className="mt-5">
      <form onSubmit={handleSubmit(handleSubmitProject)} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
            Basic Information
          </h3>

          <TextInput
            label="Project Name"
            placeholder="Enter project name"
            error={errors.name}
            {...register("name", {
              required: "Project name is required",
              minLength: {
                value: 3,
                message: "Project name must be at least 3 characters",
              },
            })}
          />

            {/* Client */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Client <span className="text-primary-10">*</span>
            </label>
            <select
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-10 focus:border-transparent transition duration-300 ${
                errors.clientId ? "border-red-500" : "border-gray-300"
              }`}
              {...register("clientId", {
                required: "Client is required"
              })}
            >
              <option value="">Select client</option>
              {clientsData?.data?.data?.map((client: any) => (
                <option key={client._id} value={client._id}>
                  {client.name} ({client.clientId})
                </option>
              ))}
            </select>
            {errors.clientId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.clientId.message}
              </p>
            )}
          </div>

          <TextInput
            label="Project Type"
            placeholder="Enter project type (e.g. Frontend, Backend, Mobile App)"
            error={errors.projectType}
            {...register("projectType", {
              required: "Project type is required",
            })}
          />

          <SelectDropdown
            label="Status"
            options={statusOptions}
            error={errors.status}
            {...register("status", { required: "Status is required" })}
          />

          <Textarea
            label="Description/Requirement Doc Link"
            placeholder="Enter project description..."
            {...register("description")}
            isRequired={false}
          />
        </div>

        {/* Timeline */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
            Timeline
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TextInput
              label="Start Date"
              type="date"
              error={errors.startDate}
              {...register("startDate")}
            />

            <TextInput
              label="End Date"
              type="date"
              error={errors.endDate}
              {...register("endDate")}
              isRequired={false}
            />

            <TextInput
              label="Deadline"
              placeholder="Enter deadline"
              error={errors.deadline}
              {...register("deadline")}
              isRequired={false}
            />
          </div>
        </div>

        {/* Financial Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
            Financial Information
          </h3>

            <SelectDropdown
              label="Currency"
              options={currencyOptions}
              {...register("priceCurrency")}
            />
        </div>

        {/* Timeline Link */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
            Additional Links
          </h3>

          <TextInput
            label="Timeline Link"
            type="url"
            placeholder="https://trello.com/..."
            {...register("timelineLink")}
            isRequired={false}
          />
        </div>

        {/* Notes */}
        <Textarea
          label="Notes"
          placeholder="Additional notes about the project..."
          {...register("notes")}
          isRequired={false}
        />

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-primary-10 text-white rounded-lg hover:bg-primary-20 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>{modalType === "add" ? "Adding..." : "Updating..."}</span>
              </>
            ) : (
              <span>
                {modalType === "add" ? "Add Project" : "Update Project"}
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddOrEditProject;
