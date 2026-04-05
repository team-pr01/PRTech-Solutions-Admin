/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import TextInput from "../../../Reusable/TextInput/TextInput";
import Textarea from "../../../Reusable/TextArea/TextArea";
import Button from "../../../Reusable/Button/Button";
import { useAddFollowUpMutation } from "../../../../redux/Features/Lead/leadApi";

type AddFollowUpFormData = {
  key: string;
  followUpDate: string;
  response?: string;
};

type AddFollowUpProps = {
  leadId: string;
  onClose: () => void;
};

const AddFollowUp = ({ leadId, onClose }: AddFollowUpProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AddFollowUpFormData>();

  const [addFollowUp] = useAddFollowUpMutation();

  const handleSubmitFollowUp = async (data: AddFollowUpFormData) => {
    try {
      const payload = {
        leadId,
        followUpDate: data.followUpDate,
        response: data.response,
        key: data.key,
      };

      const response = await addFollowUp({leadId, data: payload}).unwrap();

      if (response.success) {
        toast.success("Follow up added successfully");
        reset();
        onClose();
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to add follow up");
    }
  };

  // Get min date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <div className="mt-5">
      <form onSubmit={handleSubmit(handleSubmitFollowUp)} className="space-y-4">
        {/* Follow Up Date */}
        <TextInput
          label="Follow Up Date *"
          type="date"
          min={getMinDate()}
          placeholder="Select date"
          error={errors.followUpDate}
          {...register("followUpDate", {
            required: "Follow up date is required",
          })}
        />

        {/* Response / Notes */}
        <Textarea
          label="Response / Notes"
          placeholder="Enter response or notes from the follow up..."
          {...register("response")}
          isRequired={false}
        />

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Note:</span> Once added, the follow up
            will be tracked in the lead's history.
          </p>
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
            label={isSubmitting ? "Saving..." : "Add Follow Up"}
          />
        </div>
      </form>
    </div>
  );
};

export default AddFollowUp;
