/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import TextInput from "../../../../Reusable/TextInput/TextInput";
import {
  useAddSubordinateMutation,
  useUpdateSubordinateMutation,
} from "../../../../../redux/Features/Client/clientApi";

type SubordinateFormData = {
  name: string;
  email?: string;
  phoneNumber: {
    countryCode: string;
    phoneNumber: string;
  };
  designation?: string;
  notes?: string;
};

type AddOrEditSubordinateProps = {
  clientId: string;
  subordinateId: string;
  modalType: "add" | "edit";
  subordinateData?: SubordinateFormData; 
  onClose: () => void;
};

const AddOrEditSubordinate = ({
  clientId,
    subordinateId,
  modalType,
  subordinateData,
  onClose,
}: AddOrEditSubordinateProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SubordinateFormData>({
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: {
        countryCode: "+1",
        phoneNumber: "",
      },
      designation: "",
      notes: "",
    },
  });

  const [addSubordinate] = useAddSubordinateMutation();
  const [updateSubordinate] = useUpdateSubordinateMutation();

  // Set default values when editing
  useEffect(() => {
    if (modalType === "edit" && subordinateData) {
      reset({
        name: subordinateData.name || "",
        email: subordinateData.email || "",
        phoneNumber: {
          countryCode: subordinateData.phoneNumber?.countryCode || "+1",
          phoneNumber: subordinateData.phoneNumber?.phoneNumber || "",
        },
        designation: subordinateData.designation || "",
        notes: subordinateData.notes || "",
      });
    }
  }, [modalType, subordinateData, reset]);

  const handleSubmitSubordinate = async (data: SubordinateFormData) => {
    const payload= {
        name: data.name,
        email: data.email,
        phoneNumber: {
            countryCode: data.phoneNumber.countryCode,
            phoneNumber: data.phoneNumber.phoneNumber,
        },
        designation: data.designation,
        notes: data.notes,
        }
    try {
      if (modalType === "add") {
        // Add new subordinate
        const result = await addSubordinate({
          clientId,
          data: payload,
        }).unwrap();

        if (result.success) {
          toast.success("Subordinate added successfully");
          reset();
          onClose();
        }
      } else {
        // Update existing subordinate
        const result = await updateSubordinate({
          clientId,
          subordinateId: subordinateId!,
          data: payload,
        }).unwrap();

        if (result.success) {
          toast.success("Subordinate updated successfully");
          onClose();
        }
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          `Failed to ${modalType === "add" ? "add" : "update"} subordinate`
      );
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(handleSubmitSubordinate)} className="space-y-4">
        {/* Name */}
        <TextInput
          label="Name *"
          placeholder="Enter subordinate name"
          error={errors.name}
          {...register("name", {
            required: "Name is required",
            minLength: {
              value: 2,
              message: "Name must be at least 2 characters",
            },
          })}
        />

        {/* Email */}
        <TextInput
          label="Email"
          type="email"
          placeholder="Enter email address"
          error={errors.email}
          {...register("email", {
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
        />

        {/* Country Code & Phone Number */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <TextInput
              label="Country Code"
              placeholder="+1"
              error={errors.phoneNumber?.countryCode}
              {...register("phoneNumber.countryCode", {
                required: "Country code is required when phone is provided",
                pattern: {
                  value: /^\+\d{1,3}$/,
                  message: "Invalid country code (e.g., +1, +44, +880)",
                },
              })}
            />
          </div>
          <div className="md:col-span-2">
            <TextInput
              label="Phone Number"
              placeholder="Enter phone number"
              error={errors.phoneNumber?.phoneNumber}
              {...register("phoneNumber.phoneNumber")}
            />
          </div>
        </div>

        {/* Designation */}
        <TextInput
          label="Designation"
          placeholder="e.g., Project Manager, CTO, Finance Head"
          error={errors.designation}
          {...register("designation")}
        />

        {/* Notes */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            placeholder="Additional notes about this subordinate..."
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-10 focus:border-transparent transition duration-300 ${
              errors.notes ? "border-red-500" : "border-gray-300"
            }`}
            rows={3}
            {...register("notes")}
          />
          {errors.notes && (
            <p className="text-red-500 text-xs mt-1">{errors.notes.message}</p>
          )}
        </div>

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
              <span>{modalType === "add" ? "Add Subordinate" : "Update Subordinate"}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddOrEditSubordinate;