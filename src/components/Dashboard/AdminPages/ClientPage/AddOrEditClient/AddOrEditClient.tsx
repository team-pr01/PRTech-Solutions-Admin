/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm, useFieldArray, type FieldError } from "react-hook-form";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import TextInput from "../../../../Reusable/TextInput/TextInput";
import {
  useAddClientMutation,
  useUpdateClientMutation,
  useGetSingleClientByIdQuery,
} from "../../../../../redux/Features/Client/clientApi";
import SelectDropdown from "../../../../Reusable/SelectDropdown/SelectDropdown";
import Textarea from "../../../../Reusable/TextArea/TextArea";
import Button from "../../../../Reusable/Button/Button";

type EmailField = {
  email: string;
  type: string;
  isPrimary: boolean;
};

type PhoneNumberField = {
  type: string;
  countryCode: string;
  phoneNumber: string;
  isPrimary: boolean;
};

type SocialMedia = {
  linkedin?: string;
  twitter?: string;
  facebook?: string;
};

type ClientFormData = {
  name: string;
  emails: EmailField[];
  phoneNumbers: PhoneNumberField[];
  socialMedia?: SocialMedia;
  preferredContactMethod?: "email" | "phone" | "whatsapp" | "other";
  languages: string[];
  timezone?: string;
  country: string;
  address?: string;
  source: string;
  notes?: string;
  industry?: string;
  companySize?:
    | "1-10"
    | "11-50"
    | "51-200"
    | "201-500"
    | "500+"
    | "1000+"
    | "unknown";
};

type AddOrEditClientProps = {
  clientId?: string;
  modalType: "add" | "edit";
  onClose: () => void;
  onSuccess?: () => void;
};

const AddOrEditClient = ({
  clientId,
  modalType,
  onClose,
  onSuccess,
}: AddOrEditClientProps) => {
  const { data: clientData, isLoading: isLoadingClient } =
    useGetSingleClientByIdQuery(clientId!, {
      skip: modalType !== "edit" || !clientId,
    });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ClientFormData>();

  const {
    fields: emailFields,
    append: appendEmail,
    remove: removeEmail,
  } = useFieldArray({
    control,
    name: "emails",
  });

  const {
    fields: phoneFields,
    append: appendPhone,
    remove: removePhone,
  } = useFieldArray({
    control,
    name: "phoneNumbers",
  });

  const [addClient, { isLoading: isAdding }] = useAddClientMutation();
  const [updateClient, { isLoading: isUpdating }] = useUpdateClientMutation();

  // Set default values when editing
  useEffect(() => {
    if (modalType === "edit" && clientData?.data) {
      const client = clientData.data;
      reset({
        name: client.name || "",
        emails: client.emails?.length
          ? client.emails
          : [{ email: "", type: "business", isPrimary: true }],
        phoneNumbers: client.phoneNumbers?.length
          ? client.phoneNumbers
          : [
              {
                type: "office",
                countryCode: "+1",
                phoneNumber: "",
                isPrimary: true,
              },
            ],
        socialMedia: {
          linkedin: client.socialMedia?.linkedin || "",
          twitter: client.socialMedia?.twitter || "",
          facebook: client.socialMedia?.facebook || "",
        },
        preferredContactMethod: client.preferredContactMethod || "email",
        languages: client.languages?.length ? client.languages : [],
        timezone: client.timezone || "UTC",
        country: client.country || "",
        address: client.address || "",
        source: client.source || "",
        notes: client.notes || "",
        industry: client.industry || "",
        companySize: client.companySize || "unknown",
      });
    }
  }, [modalType, clientData, reset]);

  const handleLanguagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const languagesString = e.target.value;
    const languagesArray = languagesString
      .split(",")
      .map((lang) => lang.trim())
      .filter((lang) => lang);
    setValue("languages", languagesArray);
  };

  const getLanguagesString = () => {
    const languages = watch("languages");
    return languages?.join(", ") || "";
  };

  const handleSubmitClient = async (data: ClientFormData) => {
    try {
      // Ensure at least one primary email
      const hasPrimaryEmail = data.emails.some((email) => email.isPrimary);
      if (!hasPrimaryEmail && data.emails.length > 0) {
        data.emails[0].isPrimary = true;
      }

      // Ensure at least one primary phone
      const hasPrimaryPhone = data.phoneNumbers.some(
        (phone) => phone.isPrimary,
      );
      if (!hasPrimaryPhone && data.phoneNumbers.length > 0) {
        data.phoneNumbers[0].isPrimary = true;
      }

      if (modalType === "add") {
        const result = await addClient(data).unwrap();
        if (result.success) {
          toast.success("Client added successfully");
          reset();
          onSuccess?.();
          onClose();
        }
      } else {
        const result = await updateClient({
          id: clientId!,
          data: data,
        }).unwrap();
        if (result.success) {
          toast.success("Client updated successfully");
          onSuccess?.();
          onClose();
        }
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          `Failed to ${modalType === "add" ? "add" : "update"} client`,
      );
    }
  };

  if (modalType === "edit" && isLoadingClient) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-10"></div>
      </div>
    );
  }

  const companySize = ["1-10", "11-50", "51-200", "201-500", "500+", "1000+"];

  return (
    <div>
      <form onSubmit={handleSubmit(handleSubmitClient)} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4 mt-5">
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
            Basic Information
          </h3>

          {/* Name */}
          <TextInput
            label="Client Name *"
            placeholder="Enter client name"
            error={errors.name}
            {...register("name", {
              required: "Client name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
              },
            })}
          />

          {/* Source */}
          <SelectDropdown
            label="Source"
            options={[
              "Referral",
              "Website",
              "Cold Call",
              "Conference",
              "Social Media",
              "Other",
            ]}
            error={errors.source}
            {...register("source", { required: "Source is required" })}
          />

          {/* Industry */}
          <TextInput
            label="Industry"
            placeholder="e.g., Software Development, Finance, Healthcare"
            error={errors.industry}
            {...register("industry")}
          />

          <SelectDropdown
            label="Company Size"
            options={companySize}
            error={errors.companySize}
            {...register("companySize", {
              required: "Company size is required",
            })}
          />
        </div>

        {/* Emails Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-gray-200 pb-2">
            <h3 className="text-lg font-semibold text-gray-800">Emails</h3>
            <button
              type="button"
              onClick={() =>
                appendEmail({ email: "", type: "business", isPrimary: false })
              }
              className="flex items-center gap-1 text-sm text-primary-10 hover:text-primary-20"
            >
              <FiPlus size={16} /> Add Email
            </button>
          </div>

          {emailFields.map((field, index) => (
            <div
              key={field.id}
              className="p-4 border border-gray-200 rounded-lg space-y-3"
            >
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-gray-700">Email {index + 1}</h4>
                {emailFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEmail(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiTrash2 size={18} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <TextInput
                  label="Email Address"
                  type="email"
                  placeholder="Enter email"
                  error={errors.emails?.[index]?.email}
                  {...register(`emails.${index}.email`, {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />

                <TextInput
                  label="Email Type"
                  placeholder="Enter email type (e.g., business, personal)"
                  error={errors.emails?.[index]?.type as FieldError | undefined}
                  {...register(`emails.${index}.type`, {
                    required: "Email type is required",
                  })}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`primary-email-${index}`}
                  className="w-4 h-4 text-primary-10 rounded focus:ring-primary-10"
                  {...register(`emails.${index}.isPrimary`)}
                />
                <label
                  htmlFor={`primary-email-${index}`}
                  className="text-sm text-gray-700"
                >
                  Set as primary email
                </label>
              </div>
            </div>
          ))}
        </div>

        {/* Phone Numbers Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-gray-200 pb-2">
            <h3 className="text-lg font-semibold text-gray-800">
              Phone Numbers
            </h3>
            <button
              type="button"
              onClick={() =>
                appendPhone({
                  type: "office",
                  countryCode: "+1",
                  phoneNumber: "",
                  isPrimary: false,
                })
              }
              className="flex items-center gap-1 text-sm text-primary-10 hover:text-primary-20"
            >
              <FiPlus size={16} /> Add Phone Number
            </button>
          </div>

          {phoneFields.map((field, index) => (
            <div
              key={field.id}
              className="p-4 border border-gray-200 rounded-lg space-y-3"
            >
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-gray-700">Phone {index + 1}</h4>
                {phoneFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePhone(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiTrash2 size={18} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <TextInput
                  label="Type"
                  placeholder="Enter type (e.g., business, personal)"
                  error={errors.phoneNumbers?.[index]?.type as FieldError | undefined}
                  {...register(`phoneNumbers.${index}.type`, {
                    required: "Phone type is required",
                  })}
                />

                <TextInput
                  label="Country Code"
                  placeholder="+1"
                  error={errors.phoneNumbers?.[index]?.countryCode}
                  {...register(`phoneNumbers.${index}.countryCode`, {
                    required: "Country code is required",
                    pattern: {
                      value: /^\+\d{1,3}$/,
                      message: "Invalid country code (e.g., +1, +44, +880)",
                    },
                  })}
                />

                <TextInput
                  label="Phone Number"
                  placeholder="Enter phone number"
                  error={errors.phoneNumbers?.[index]?.phoneNumber}
                  {...register(`phoneNumbers.${index}.phoneNumber`, {
                    required: "Phone number is required",
                  })}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`primary-phone-${index}`}
                  className="w-4 h-4 text-primary-10 rounded focus:ring-primary-10"
                  {...register(`phoneNumbers.${index}.isPrimary`)}
                />
                <label
                  htmlFor={`primary-phone-${index}`}
                  className="text-sm text-gray-700"
                >
                  Set as primary phone number
                </label>
              </div>
            </div>
          ))}
        </div>

        {/* Location Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
            Location Information
          </h3>

          <TextInput
            label="Country *"
            placeholder="Enter country"
            error={errors.country}
            {...register("country", { required: "Country is required" })}
          />

          <TextInput
            label="Address"
            placeholder="Enter full address"
            error={errors.address}
            {...register("address")}
          />
        </div>

        {/* Communication Preferences */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
            Communication Preferences
          </h3>

          <SelectDropdown
            label="Preferred Contact Method"
            options={["email", "phone", "whatsapp", "other"]}
            error={errors.preferredContactMethod}
            {...register("preferredContactMethod", {
              required: "Preferred contact method is required",
            })}
          />

          <TextInput
            name="languages"
            label="Languages (comma separated)"
            placeholder="e.g., English, Spanish, French"
            defaultValue={getLanguagesString()}
            onChange={handleLanguagesChange}
          />

          <TextInput
            label="Timezone"
            placeholder="e.g., America/New_York, Europe/London"
            error={errors.timezone}
            {...register("timezone")}
          />
        </div>

        {/* Social Media */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
            Social Media
          </h3>

          <TextInput
            label="LinkedIn"
            placeholder="https://linkedin.com/company/..."
            {...register("socialMedia.linkedin")}
          />

          <TextInput
            label="Twitter"
            placeholder="https://twitter.com/..."
            {...register("socialMedia.twitter")}
          />

          <TextInput
            label="Facebook"
            placeholder="https://facebook.com/..."
            {...register("socialMedia.facebook")}
          />
        </div>

        {/* Additional Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
            Additional Information
          </h3>

          <Textarea
            label="Notes"
            placeholder="Additional notes about the client..."
            {...register("notes")}
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            onClick={onClose}
            variant="secondary"
            type="submit"
            label={"Cancel"}
          />
          <Button
            type="submit"
            label={isAdding || isUpdating ? "Please wait..." : "Submit"}
          />
        </div>
      </form>
    </div>
  );
};

export default AddOrEditClient;
