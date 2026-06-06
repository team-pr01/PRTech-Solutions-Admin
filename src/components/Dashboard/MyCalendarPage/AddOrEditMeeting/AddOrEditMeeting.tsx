/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect } from "react";
import TextInput from "../../../Reusable/TextInput/TextInput";
import Textarea from "../../../Reusable/TextArea/TextArea";
import Button from "../../../Reusable/Button/Button";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import {
  useAddMeetingMutation,
  useUpdateMeetingMutation,
  useGetSingleMeetingQuery,
} from "../../../../redux/Features/Calendar/calendarApi";
import toast from "react-hot-toast";

type TAddOrEditMeetingProps = {
  meetingId?: string;
  modalType: "add" | "edit";
  onClose: () => void;
  onSuccess?: () => void;
};

type TFormData = {
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  meetingLink: string;
  attendees: any[];
  status: string;
};

const AddOrEditMeeting: React.FC<TAddOrEditMeetingProps> = ({
  meetingId,
  modalType,
  onClose,
  onSuccess,
}) => {
  const [addMeeting] = useAddMeetingMutation();
  const [updateMeeting] = useUpdateMeetingMutation();

  const { data: meetingData, isLoading: isLoadingMeeting } =
    useGetSingleMeetingQuery(meetingId!, {
      skip: modalType !== "edit" || !meetingId,
    });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TFormData>({
    defaultValues: {
      title: "",
      description: "",
      date: "",
      startTime: "",
      endTime: "",
      meetingLink: "",
      attendees: [""],
      status: "upcoming",
    },
  });

  const { fields, append, remove } = useFieldArray<TFormData>({
    control,
    name: "attendees",
  });

  // Set default values when editing
  useEffect(() => {
    if (modalType === "edit" && meetingData?.data) {
      const meeting = meetingData.data;

      // Format date to YYYY-MM-DD for input
      const formattedDate = meeting.date
        ? new Date(meeting.date).toISOString().split("T")[0]
        : "";

      reset({
        title: meeting.title || "",
        description: meeting.description || "",
        date: formattedDate,
        startTime: meeting.startTime || "",
        endTime: meeting.endTime || "",
        meetingLink: meeting.meetingLink || "",
        attendees: meeting.attendees?.length ? meeting.attendees : [""],
        status: meeting.status || "upcoming",
      });
    }
  }, [modalType, meetingData, reset]);

  const handleSubmitMeeting = async (data: TFormData) => {
    try {
      const payload = {
        title: data.title,
        description: data.description,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        meetingLink: data.meetingLink,
        attendees: data.attendees.filter(
          (attendee) => attendee.trim() !== "",
        ),
        status: data.status,
      };

      if (modalType === "add") {
        const result = await addMeeting(payload).unwrap();
        if (result.success) {
          toast.success("Meeting added successfully");
          reset();
          onSuccess?.();
          onClose();
        }
      } else {
        const result = await updateMeeting({
          meetingId: meetingId!,
          data: payload,
        }).unwrap();
        if (result.success) {
          toast.success("Meeting updated successfully");
          onSuccess?.();
          onClose();
        }
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Something went wrong. Please try again.",
      );
    }
  };

  if (modalType === "edit" && isLoadingMeeting) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-10"></div>
      </div>
    );
  }

  return (
    <div className="mt-5">
      <form onSubmit={handleSubmit(handleSubmitMeeting)} className="space-y-4">
        {/* Meeting Title */}
        <TextInput
          label="Meeting Title"
          placeholder="Enter meeting title"
          error={errors.title}
          {...register("title", {
            required: "Meeting title is required",
            minLength: {
              value: 3,
              message: "Title must be at least 3 characters",
            },
          })}
        />

        {/* Date */}
        <TextInput
          label="Date"
          type="date"
          error={errors.date}
          {...register("date", {
            required: "Date is required",
          })}
        />

        {/* Start Time and End Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            label="Start Time"
            type="time"
            error={errors.startTime}
            {...register("startTime", {
              required: "Start time is required",
            })}
          />
          <TextInput
            label="End Time"
            type="time"
            error={errors.endTime}
            {...register("endTime", {
              required: "End time is required",
            })}
          />
        </div>

        {/* Description */}
        <Textarea
          label="Description"
          placeholder="Enter meeting description..."
          {...register("description")}
          isRequired={false}
        />

        {/* Meeting Link */}
        <TextInput
          label="Meeting Link"
          type="url"
          placeholder="https://meet.google.com/..."
          error={errors.meetingLink}
          {...register("meetingLink")}
          isRequired={false}
        />

        {/* Attendees Section */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Attendees
          </label>
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput
                  placeholder={`Attendee ${index + 1}`}
                  error={errors.attendees?.[index]}
                  {...register(`attendees.${index}`, {
                    required: "Attendee name is required",
                  })}
                />
              </div>
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-500 hover:text-red-700 p-1 mt-2"
                title="Remove attendee"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => append("")}
            className="flex items-center gap-1 text-sm text-primary-10 hover:text-primary-20 mt-2"
          >
            <FiPlus size={14} /> Add Attendee
          </button>
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
                ? "Saving..."
                : modalType === "add"
                  ? "Add Meeting"
                  : "Update Meeting"
            }
          />
        </div>
      </form>
    </div>
  );
};

export default AddOrEditMeeting;
