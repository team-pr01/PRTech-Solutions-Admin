/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import TextInput from "../../../Reusable/TextInput/TextInput";
import Textarea from "../../../Reusable/TextArea/TextArea";
import SelectDropdown from "../../../Reusable/SelectDropdown/SelectDropdown";
import Button from "../../../Reusable/Button/Button";
import {
  useAddLeadMutation,
  useGetSingleLeadByIdQuery,
  useUpdateLeadMutation,
} from "../../../../redux/Features/Lead/leadApi";

type SocialMedia = {
  platform: string;
  url: string;
};

type LeadFormData = {
  // Basic Information
  businessName: string;
  businessContactNumber: string;
  country: string;
  city?: string;
  address?: string;

  // Owner Information
  ownerName: string;
  ownerContactNumber: string;
  isWhatsapp: boolean;
  ownerEmail?: string;

  // Social Media & Online Presence
  socialMedia: SocialMedia[];
  website?: string;

  // Lead Details
  issueFound?: string;
  priority: number;
  category: string;

  // Discovery Call
  discoveryCallScheduledDate?: string;
  discoveryCallScheduledTime?: string;
  discoveryCallNotes?: string;

  // Status & Tracking
  status:
    | "Pending"
    | "Ongoing"
    | "Discovery Call Scheduled"
    | "Closed"
    | "Not Interested"
    | "For Future";
  nextAction?: string;

  // Additional Information
  leadSource?: string;
  notes?: string;
};

type AddOrEditLeadProps = {
  leadId?: string;
  modalType: "add" | "edit";
  onClose: () => void;
  categories: any;
};

const AddOrEditLead = ({
  leadId,
  modalType,
  onClose,
  categories,
}: AddOrEditLeadProps) => {
  const { data: leadData, isLoading: isLoadingLead } =
    useGetSingleLeadByIdQuery(leadId!, {
      skip: modalType !== "edit" || !leadId,
    });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LeadFormData>({
    defaultValues: {
      businessName: "",
      businessContactNumber: "",
      country: "",
      city: "",
      address: "",
      ownerName: "",
      ownerContactNumber: "",
      isWhatsapp: false,
      ownerEmail: "",
      socialMedia: [],
      website: "",
      issueFound: "",
      priority: 3,
      category: "",
      discoveryCallScheduledDate: "",
      discoveryCallScheduledTime: "",
      discoveryCallNotes: "",
      status: "Pending",
      nextAction: "",
      leadSource: "",
      notes: "",
    },
  });

  const {
    fields: socialMediaFields,
    append: appendSocialMedia,
    remove: removeSocialMedia,
  } = useFieldArray({
    control,
    name: "socialMedia",
  });

  const [addLead] = useAddLeadMutation();
  const [updateLead] = useUpdateLeadMutation();

  // Options for dropdowns
  const statusOptions = [
    "Pending",
    "Ongoing",
    "Discovery Call Scheduled",
    "Closed",
    "Not Interested",
    "For Future",
  ];

  const priorityOptions = [1, 2, 3, 4, 5];

  const socialMediaPlatforms = [
    "LinkedIn",
    "Twitter",
    "Facebook",
    "Instagram",
    "YouTube",
    "TikTok",
    "Other",
  ];

  // Set default values when editing
  useEffect(() => {
    if (modalType === "edit" && leadData?.data) {
      const lead = leadData.data;

      // Extract date and time from discoveryCallScheduledDate if it exists
      let discoveryDate = "";
      let discoveryTime = "";
      if (lead.discoveryCallScheduledDate) {
        const date = new Date(lead.discoveryCallScheduledDate);
        discoveryDate = date.toISOString().split("T")[0];
        discoveryTime = date.toTimeString().slice(0, 5);
      }

      reset({
        businessName: lead.businessName || "",
        businessContactNumber: lead.businessContactNumber || "",
        country: lead.country || "",
        city: lead.city || "",
        address: lead.address || "",
        ownerName: lead.ownerName || "",
        ownerContactNumber: lead.ownerContactNumber || "",
        isWhatsapp: lead.isWhatsapp || false,
        ownerEmail: lead.ownerEmail || "",
        socialMedia: lead.socialMedia || [],
        website: lead.website || "",
        issueFound: lead.issueFound || "",
        priority: lead.priority || "",
        category: lead.category || "",
        discoveryCallScheduledDate: discoveryDate,
        discoveryCallScheduledTime: discoveryTime,
        discoveryCallNotes: lead.discoveryCallNotes || "",
        status: lead.status || "Pending",
        nextAction: lead.nextAction || "",
        leadSource: lead.leadSource || "",
        notes: lead.notes || "",
      });
    }
  }, [modalType, leadData, reset]);

  const handleSubmitLead = async (data: LeadFormData) => {
    try {
      // Combine date and time if both exist
      let discoveryCallScheduledDate = undefined;
      if (data.discoveryCallScheduledDate && data.discoveryCallScheduledTime) {
        discoveryCallScheduledDate = new Date(
          `${data.discoveryCallScheduledDate}T${data.discoveryCallScheduledTime}:00`,
        ).toISOString();
      }

      const payload = {
        ...data,
        discoveryCallScheduledDate,
        priority: Number(data.priority),
      };

      if (modalType === "add") {
        const result = await addLead(payload).unwrap();
        if (result.success) {
          toast.success("Lead added successfully");
          reset();
          onClose();
        }
      } else {
        const result = await updateLead({
          id: leadId!,
          data: payload,
        }).unwrap();
        if (result.success) {
          toast.success("Lead updated successfully");
          onClose();
        }
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          `Failed to ${modalType === "add" ? "add" : "update"} lead`,
      );
    }
  };

  const leadCategories =
    categories?.map((category: any) => category.category) || [];

  if (modalType === "edit" && isLoadingLead) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-10"></div>
      </div>
    );
  }

  return (
    <div className="mt-5">
      <form onSubmit={handleSubmit(handleSubmitLead)} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
            Basic Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Business Name"
              placeholder="Enter business name"
              error={errors.businessName}
              {...register("businessName", {
                required: "Business name is required",
              })}
            />

            <TextInput
              label="Business Contact Number"
              placeholder="Enter business contact number"
              error={errors.businessContactNumber}
              {...register("businessContactNumber", {
                required: "Business contact number is required",
              })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Country"
              placeholder="Enter country"
              error={errors.country}
              {...register("country", {
                required: "Country is required",
              })}
            />

            <TextInput
              label="City"
              placeholder="Enter city"
              error={errors.city}
              {...register("city")}
            />
          </div>

          <TextInput
            label="Address"
            placeholder="Enter full address"
            error={errors.address}
            {...register("address")}
            isRequired={false}
          />
        </div>

        {/* Owner Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
            Owner Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Owner Name"
              placeholder="Enter owner name"
              error={errors.ownerName}
              {...register("ownerName")}
              isRequired={false}
            />

            <TextInput
              label="Owner Contact Number"
              placeholder="Enter owner contact number"
              error={errors.ownerContactNumber}
              {...register("ownerContactNumber")}
              isRequired={false}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Owner Email"
              type="email"
              placeholder="Enter owner email"
              error={errors.ownerEmail}
              {...register("ownerEmail", {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              isRequired={false}
            />

            <div className="flex items-center gap-3 mt-2">
              <input
                type="checkbox"
                id="isWhatsapp"
                className="w-4 h-4 text-primary-10 rounded focus:ring-primary-10"
                {...register("isWhatsapp")}
              />
              <label htmlFor="isWhatsapp" className="text-sm text-gray-700">
                Is WhatsApp available for this number?
              </label>
            </div>
          </div>
        </div>

        {/* Lead Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
            Lead Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectDropdown
              label="Category"
              options={leadCategories || []}
              error={errors.category}
              {...register("category", {
                required: "Category is required",
              })}
            />

            <SelectDropdown
              label="Priority"
              options={priorityOptions}
              error={errors.priority}
              {...register("priority", {
                required: "Priority is required",
              })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectDropdown
              label="Status"
              options={statusOptions}
              error={errors.status}
              {...register("status", {
                required: "Status is required",
              })}
            />

            <TextInput
              label="Lead Source"
              placeholder="(e.g. Referral, Website, Cold Call)"
              error={errors.leadSource}
              {...register("leadSource")}
            />
          </div>

          <TextInput
            label="Issue Found"
            placeholder="Describe the issue or requirement"
            error={errors.issueFound}
            {...register("issueFound")}
          />

          <TextInput
            label="Next Action"
            placeholder="What is the next action for this lead?"
            error={errors.nextAction}
            {...register("nextAction")}
            isRequired={false}
          />
        </div>

        {/* Social Media Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-gray-200 pb-2">
            <h3 className="text-lg font-semibold text-gray-800">
              Social Media
            </h3>
            <button
              type="button"
              onClick={() => appendSocialMedia({ platform: "", url: "" })}
              className="flex items-center gap-1 text-sm text-primary-10 hover:text-primary-20"
            >
              <FiPlus size={16} /> Add Social Media
            </button>
          </div>

          {socialMediaFields.map((field, index) => (
            <div
              key={field.id}
              className="p-4 border border-gray-200 rounded-lg space-y-3"
            >
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-gray-700">
                  Social Media {index + 1}
                </h4>
                <button
                  type="button"
                  onClick={() => removeSocialMedia(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <SelectDropdown
                  label="Platform"
                  options={socialMediaPlatforms}
                  {...register(`socialMedia.${index}.platform`)}
                />

                <TextInput
                  label="URL"
                  type="url"
                  placeholder="https://..."
                  {...register(`socialMedia.${index}.url`)}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Website */}
        <div className="space-y-4">
          <TextInput
            label="Website"
            type="url"
            placeholder="https://example.com"
            {...register("website")}
            isRequired={false}
          />
        </div>

        {/* Discovery Call */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
            Discovery Call
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Scheduled Date"
              type="date"
              {...register("discoveryCallScheduledDate")}
              isRequired={false}
            />

            <TextInput
              label="Scheduled Time"
              type="time"
              {...register("discoveryCallScheduledTime")}
              isRequired={false}
            />
          </div>

          <Textarea
            label="Call Notes"
            placeholder="Enter any notes for the discovery call..."
            {...register("discoveryCallNotes")}
            isRequired={false}
          />
        </div>

        {/* Additional Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
            Additional Information
          </h3>

          <Textarea
            label="Notes"
            placeholder="Any additional notes about this lead..."
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
                  ? "Add Lead"
                  : "Update Lead"
            }
          />
        </div>
      </form>
    </div>
  );
};

export default AddOrEditLead;
