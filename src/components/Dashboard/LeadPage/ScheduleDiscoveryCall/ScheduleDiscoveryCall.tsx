/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import TextInput from "../../../Reusable/TextInput/TextInput";
import { useScheduleDiscoveryCallMutation } from "../../../../redux/Features/Lead/leadApi";
import Button from "../../../Reusable/Button/Button";
import Textarea from "../../../Reusable/TextArea/TextArea";

type ScheduleDiscoveryCallFormData = {
  discoveryCallScheduledDate: string;
  discoveryCallScheduledTime: string;
  discoveryCallNotes?: string;
};

type ScheduleDiscoveryCallProps = {
  leadName?: string;
  existingData?: {
    _id: string;
    discoveryCallScheduledDate?: string;
    discoveryCallScheduledTime?: string;
    discoveryCallNotes?: string;
  };
  onClose: () => void;
};

const ScheduleDiscoveryCall = ({
  existingData,
  onClose,
}: ScheduleDiscoveryCallProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<ScheduleDiscoveryCallFormData>();

  const [scheduleDiscoveryCall] = useScheduleDiscoveryCallMutation();

  // Set default values when editing
  useEffect(() => {
    if (existingData?.discoveryCallScheduledDate) {
      const date = new Date(existingData.discoveryCallScheduledDate);
      const dateString = date.toISOString().split("T")[0];
      const timeString = date.toTimeString().slice(0, 5);

      setValue("discoveryCallScheduledDate", dateString);
      setValue("discoveryCallScheduledTime", timeString);
      setValue("discoveryCallNotes", existingData.discoveryCallNotes || "");
    }
  }, [existingData, setValue]);

  const handleSubmitSchedule = async (data: ScheduleDiscoveryCallFormData) => {
    try {
      // Combine date and time into a single ISO string
      const scheduledDateTime = new Date(
        `${data.discoveryCallScheduledDate}T${data.discoveryCallScheduledTime}:00`,
      ).toISOString();

      const payload = {
        discoveryCallScheduledDate: scheduledDateTime,
        discoveryCallNotes: data.discoveryCallNotes,
      };

      const response = await scheduleDiscoveryCall({
        id: existingData?._id,
        data: payload,
      }).unwrap();
      console.log(response);

      if (response.success) {
        toast.success(
          existingData?.discoveryCallScheduledDate
            ? "Discovery call updated successfully"
            : "Discovery call scheduled successfully",
        );
        reset();
        onClose();
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to schedule discovery call");
    }
  };

  // Get min date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <div className="mt-5">
      <form onSubmit={handleSubmit(handleSubmitSchedule)} className="space-y-4">
        {/* Discovery Call Scheduled Date */}
        <TextInput
          label="Call Date"
          type="date"
          min={getMinDate()}
          placeholder="Select date"
          error={errors.discoveryCallScheduledDate}
          {...register("discoveryCallScheduledDate", {
            required: "Call date is required",
          })}
        />

        {/* Discovery Call Scheduled Time */}
        <TextInput
          label="Call Time"
          type="time"
          min={getMinDate()}
          placeholder="Select time"
          error={errors.discoveryCallScheduledTime}
          {...register("discoveryCallScheduledTime", {
            required: "Call time is required",
          })}
        />

        {/* Discovery Call Notes */}
        <Textarea
          label="Call Notes"
          placeholder="Enter any notes or agenda for this discovery call..."
          {...register("discoveryCallNotes")}
          isRequired={false}
        />

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Note:</span> Once scheduled, the lead
            status will be updated to "Discovery Call Scheduled".
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
            label={
              isSubmitting
                ? "Scheduling..."
                : existingData?.discoveryCallScheduledDate
                  ? "Update Schedule"
                  : "Schedule Call"
            }
          />
        </div>
      </form>
    </div>
  );
};

export default ScheduleDiscoveryCall;
