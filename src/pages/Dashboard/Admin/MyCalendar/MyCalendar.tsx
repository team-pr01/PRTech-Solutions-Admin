/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import Modal from "../../../../components/Reusable/Modal/Modal";
import AddOrEditMeeting from "../../../../components/Dashboard/MyCalendarPage/AddOrEditMeeting/AddOrEditMeeting";
import Calendar from "../../../../components/Dashboard/MyCalendarPage/Calendar/Calendar";
import MeetingsList from "../../../../components/Dashboard/MyCalendarPage/MeetingsList/MeetingsList";
import { useGetMyCalendarQuery, useUpdateMeetingStatusMutation } from "../../../../redux/Features/Calendar/calendarApi";
import toast from "react-hot-toast";

// Types
export type TCalendar = {
  _id: string;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  meetingLink?: string;
  attendees: string[];
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  userId: any;
  createdAt?: Date;
  updatedAt?: Date;
};

const MyCalendar = () => {
  const [updateMeetingStatus] = useUpdateMeetingStatusMutation();
  
  const [isAddOrEditMeetingModalOpen, setIsAddOrEditMeetingModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit">("add");
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Convert selectedDate to ISO format for API call
  const selectedDateISO = selectedDate.toISOString().split("T")[0];
  
  const { data, refetch } = useGetMyCalendarQuery({ date: selectedDateISO });
  const meetings = data?.data?.data || [];

  // Check if a date has meetings
  const getHasMeetings = (date: Date) => {
    return meetings?.some((meeting: TCalendar) => {
      const meetingDate = new Date(meeting.date);
      return meetingDate.toDateString() === date.toDateString();
    });
  };

  // Handle status change
  const handleStatusChange = async (meetingId: string, status: string) => {
    try {
      await updateMeetingStatus({ meetingId, status }).unwrap();
      toast.success(`Meeting marked as ${status}`);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update meeting status");
    }
  };

  // Handle edit meeting
  const handleEditMeeting = (meeting: TCalendar) => {
    setModalType("edit");
    setSelectedMeetingId(meeting._id);
    setIsAddOrEditMeetingModalOpen(true);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Calendar</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your daily meetings
          </p>
        </div>
        <button
          className="flex items-center gap-2 bg-primary-10 text-white px-4 py-2 rounded-lg hover:bg-primary-20 transition shadow-sm"
          onClick={() => {
            setModalType("add");
            setSelectedMeetingId(null);
            setIsAddOrEditMeetingModalOpen(true);
          }}
        >
          <FiPlus size={16} />
          Add Meeting
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Section */}
        <div className="lg:col-span-1">
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            getHasMeetings={getHasMeetings}
          />
        </div>

        {/* Meetings Section */}
        <div className="lg:col-span-2">
          <MeetingsList
            selectedDate={selectedDate}
            meetings={meetings}
            onEditMeeting={handleEditMeeting}
            onStatusChange={handleStatusChange}
          />
        </div>
      </div>

      <Modal
        heading={modalType === "add" ? "Add Meeting" : "Edit Meeting"}
        isModalOpen={isAddOrEditMeetingModalOpen}
        setIsModalOpen={setIsAddOrEditMeetingModalOpen}
      >
        <AddOrEditMeeting
          meetingId={selectedMeetingId as string}
          modalType={modalType}
          onClose={() => setIsAddOrEditMeetingModalOpen(false)}
          onSuccess={() => {
            refetch();
            setIsAddOrEditMeetingModalOpen(false);
          }}
        />
      </Modal>
    </div>
  );
};

export default MyCalendar;