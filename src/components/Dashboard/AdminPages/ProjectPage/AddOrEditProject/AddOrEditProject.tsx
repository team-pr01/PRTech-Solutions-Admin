/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import TextInput from "../../../../Reusable/TextInput/TextInput";
import SelectDropdown from "../../../../Reusable/SelectDropdown/SelectDropdown";
import {
  useAddProjectMutation,
  useUpdateProjectMutation,
  useGetSingleProjectByIdQuery,
} from "../../../../../redux/Features/Project/projectApi";
import { useGetAllClientsQuery } from "../../../../../redux/Features/Client/clientApi";
import Textarea from "../../../../Reusable/TextArea/TextArea";

type Installment = {
  amount: number;
  date: string;
  paymentMethod?: "Cash" | "Bank Transfer" | "Credit Card" | "PayPal" | "Other";
  receiver?: string;
  note?: string;
};

type ContactPerson = {
  name: string;
  countryCode: string;
  phoneNumber: string;
  isPrimary?: boolean;
};

type ProjectFormData = {
  name: string;
  projectType:
    | "Frontend"
    | "Backend"
    | "Full Stack Website"
    | "Mobile App-Android"
    | "Mobile App-iOS"
    | "UI/UX Design"
    | "Redesign"
    | "Other";
  description?: string;
  startDate?: string;
  endDate?: string;
  status: "Ongoing" | "Completed" | "On Hold" | "Yet to Start";
  priceCurrency: string;
  price: number;
  installments: Installment[];
  phases: string[];
  onGoingPhase?: string;
  timelineLink?: string;
  contactPerson: ContactPerson[];
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

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProjectFormData>();

  const {
    fields: installmentFields,
    append: appendInstallment,
    remove: removeInstallment,
  } = useFieldArray({
    control,
    name: "installments",
  });

  const {
    fields: phaseFields,
    append: appendPhase,
    remove: removePhase,
  } = useFieldArray<any>({
    control,
    name: "phases",
  });

  const {
    fields: contactFields,
    append: appendContact,
    remove: removeContact,
  } = useFieldArray({
    control,
    name: "contactPerson",
  });

  const [addProject] = useAddProjectMutation();
  const [updateProject] = useUpdateProjectMutation();

  // Options for dropdowns
  const projectTypeOptions = [
    "Frontend",
    "Backend",
    "Full Stack Website",
    "Mobile App-Android",
    "Mobile App-iOS",
    "UI/UX Design",
    "Redesign",
    "Other",
  ];

  const statusOptions = ["Yet to Start", "Ongoing", "On Hold", "Completed"];

  const currencyOptions = ["BDT", "INR", "USD", "Other"];

  const paymentMethodOptions = [
    "Bank Transfer",
    "Cash",
    "bKash",
    "Nagad",
    "PhonePe",
    "Google Pay",
    "PayPal",
    "Payoneer",
    "Other",
  ];

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
        status: project.status || "Yet to Start",
        priceCurrency: project.priceCurrency || "USD",
        price: project.price || 0,
        installments:
          project.installments?.map((inst: any) => ({
            amount: inst.amount,
            date: inst.date ? inst.date.split("T")[0] : "",
            paymentMethod: inst.paymentMethod,
            receiver: inst.receiver,
            note: inst.note,
          })) || [],
        phases: project.phases || [],
        onGoingPhase: project.onGoingPhase || "",
        timelineLink: project.timelineLink || "",
        contactPerson: project.contactPerson?.length
          ? project.contactPerson
          : [{ name: "", countryCode: "", phoneNumber: "", isPrimary: true }],
        notes: project.notes || "",
        clientId: project.clientId?._id || project.clientId || "",
      });
    } else if (modalType === "add") {
      reset({
        name: "",
        projectType: "Frontend",
        description: "",
        startDate: "",
        endDate: "",
        status: "Yet to Start",
        priceCurrency: "USD",
        price: 0,
        installments: [],
        phases: [],
        onGoingPhase: "",
        timelineLink: "",
        contactPerson: [
          { name: "", countryCode: "", phoneNumber: "", isPrimary: true },
        ],
        notes: "",
        clientId: "",
      });
    }
  }, [modalType, projectData, reset]);

  const handleSubmitProject = async (data: ProjectFormData) => {
    try {
      // Ensure at least one primary contact
      const hasPrimaryContact = data.contactPerson.some(
        (contact) => contact.isPrimary,
      );
      if (!hasPrimaryContact && data.contactPerson.length > 0) {
        data.contactPerson[0].isPrimary = true;
      }

      // Convert date strings to ISO format
      const payload = {
        ...data,
        startDate: data.startDate
          ? new Date(data.startDate).toISOString()
          : undefined,
        endDate: data.endDate
          ? new Date(data.endDate).toISOString()
          : undefined,
        installments: data.installments.map((inst) => ({
          ...inst,
          date: inst.date ? new Date(inst.date).toISOString() : undefined,
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

          {/* Project Name */}
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

          {/* Client Selection */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Client <span className="text-primary-10">*</span>
            </label>
            <select
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-10 focus:border-transparent transition duration-300 ${
                errors.clientId ? "border-red-500" : "border-gray-300"
              }`}
              {...register("clientId", { required: "Client is required" })}
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

          {/* Project Type */}
          <SelectDropdown
            label="Project Type"
            options={projectTypeOptions}
            error={errors.projectType}
            {...register("projectType", {
              required: "Project type is required",
            })}
          />

          {/* Status */}
          <SelectDropdown
            label="Status"
            options={statusOptions}
            error={errors.status}
            {...register("status", { required: "Status is required" })}
          />

          {/* Description */}
          <Textarea
            label="Description"
            placeholder="Enter project description..."
            {...register("description")}
          />
        </div>

        {/* Timeline */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
            Timeline
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
        </div>

        {/* Financial Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
            Financial Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectDropdown
              label="Currency"
              options={currencyOptions}
              {...register("priceCurrency")}
            />

            <TextInput
              label="Total Price"
              type="number"
              placeholder="Enter total price"
              error={errors.price}
              {...register("price", {
                required: "Price is required",
                min: { value: 0, message: "Price must be positive" },
                valueAsNumber: true,
              })}
            />
          </div>
        </div>

        {/* Installments Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-gray-200 pb-2">
            <h3 className="text-lg font-semibold text-gray-800">
              Installments
            </h3>
            <button
              type="button"
              onClick={() =>
                appendInstallment({
                  amount: 0,
                  date: "",
                  paymentMethod: "Bank Transfer",
                  receiver: "",
                  note: "",
                })
              }
              className="flex items-center gap-1 text-sm text-primary-10 hover:text-primary-20"
            >
              <FiPlus size={16} /> Add Installment
            </button>
          </div>

          {installmentFields.map((field, index) => (
            <div
              key={field.id}
              className="p-4 border border-gray-200 rounded-lg space-y-3"
            >
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-gray-700">
                  Installment {index + 1}
                </h4>
                <button
                  type="button"
                  onClick={() => removeInstallment(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <TextInput
                  label="Amount"
                  type="number"
                  placeholder="Enter amount"
                  error={errors.installments?.[index]?.amount}
                  {...register(`installments.${index}.amount`, {
                    required: "Amount is required",
                    min: { value: 0, message: "Amount must be positive" },
                    valueAsNumber: true,
                  })}
                />

                <TextInput
                  label="Date"
                  type="date"
                  error={errors.installments?.[index]?.date}
                  {...register(`installments.${index}.date`, {
                    required: "Date is required",
                  })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <SelectDropdown
                  label="Payment Method"
                  options={paymentMethodOptions}
                  {...register(`installments.${index}.paymentMethod`)}
                />

                <TextInput
                  label="Receiver"
                  placeholder="Receiver name"
                  {...register(`installments.${index}.receiver`)}
                />
              </div>

              <Textarea
                label="Note"
                placeholder="Additional note"
                {...register(`installments.${index}.note`)}
              />
            </div>
          ))}
        </div>

        {/* Phases Section */}
        <div className="space-y-4">
          <div className="border-b border-gray-200 pb-2 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Phases</h3>
            <button
              type="button"
              onClick={() => appendPhase("" as any)}
              className="flex items-center gap-1 text-sm text-primary-10 hover:text-primary-20"
            >
              <FiPlus size={16} /> Add
            </button>
          </div>

          {phaseFields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput
                  placeholder={`Phase ${index + 1}`}
                  {...register(`phases.${index}`, {
                    required: "Phase name is required",
                  })}
                />
              </div>
              <button
                type="button"
                onClick={() => removePhase(index)}
                className="text-red-500 hover:text-red-700 mt-2"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          ))}

          {phaseFields.length > 0 && (
            <TextInput
              label="Ongoing Phase"
              placeholder="Current ongoing phase"
              {...register("onGoingPhase")}
              isRequired={false}
            />
          )}
        </div>

        {/* Contact Persons Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-gray-200 pb-2">
            <h3 className="text-lg font-semibold text-gray-800">
              Contact Persons
            </h3>
            <button
              type="button"
              onClick={() =>
                appendContact({
                  name: "",
                  countryCode: "+1",
                  phoneNumber: "",
                  isPrimary: false,
                })
              }
              className="flex items-center gap-1 text-sm text-primary-10 hover:text-primary-20"
            >
              <FiPlus size={16} /> Add Contact
            </button>
          </div>

          {contactFields.map((field, index) => (
            <div
              key={field.id}
              className="p-4 border border-gray-200 rounded-lg space-y-3"
            >
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-gray-700">
                  Contact {index + 1}
                </h4>
                {contactFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeContact(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiTrash2 size={18} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3">
                <TextInput
                  label="Name"
                  placeholder="Contact name"
                  error={errors.contactPerson?.[index]?.name}
                  {...register(`contactPerson.${index}.name`, {
                    required: "Name is required",
                  })}
                />

                <div className="grid grid-cols-2 gap-2">
                  <TextInput
                    label="Country Code"
                    placeholder="+1"
                    {...register(`contactPerson.${index}.countryCode`)}
                  />

                  <TextInput
                    label="Phone Number"
                    placeholder="Phone number"
                    error={errors.contactPerson?.[index]?.phoneNumber}
                    {...register(`contactPerson.${index}.phoneNumber`, {
                      required: "Phone number is required",
                    })}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`primary-contact-${index}`}
                  className="w-4 h-4 text-primary-10 rounded focus:ring-primary-10"
                  {...register(`contactPerson.${index}.isPrimary`)}
                />
                <label
                  htmlFor={`primary-contact-${index}`}
                  className="text-sm text-gray-700"
                >
                  Set as primary contact
                </label>
              </div>
            </div>
          ))}
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
