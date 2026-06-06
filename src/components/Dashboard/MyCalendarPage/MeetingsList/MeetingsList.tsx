/* eslint-disable @typescript-eslint/no-explicit-any */
import { FiCalendar, FiClock, FiVideo, FiUsers, FiEdit2, FiTrash2 } from "react-icons/fi";
import { formatDate } from "../../../../utils/formatDate";

type TMeetingsListProps = {
  selectedDate: Date;
  meetings: any[];
  onEditMeeting?: (meeting: any) => void;
  onDeleteMeeting?: (meetingId: string) => void;
  onStatusChange?: (meetingId: string, status: string) => void;
};

const MeetingsList: React.FC<TMeetingsListProps> = ({
  selectedDate,
  meetings,
  onEditMeeting,
  onDeleteMeeting,
  onStatusChange,
}) => {
  const getMeetingsForDate = (date: Date) => {
    return meetings?.filter((meeting: any) => {
      const meetingDate = new Date(meeting.date);
      return meetingDate.toDateString() === date.toDateString();
    });
  };

  const selectedDateMeetings = getMeetingsForDate(selectedDate);

  // Helper function to convert 24hr time to 12hr format with AM/PM
const convertTo12HourFormat = (time: string) => {
  if (!time) return time;
  
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  let hours12 = hours % 12;
  hours12 = hours12 === 0 ? 12 : hours12;
  
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
};

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
      {/* Selected Date Header */}
      <div className="p-5 border-b border-gray-100">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
            })}
          </h3>
          <p className="text-sm text-gray-400 mt-0.5">
            {formatDate(selectedDate as any)}
          </p>
        </div>
      </div>

      {/* Meetings List */}
      <div className="flex-1 p-5 space-y-4 max-h-[500px] overflow-y-auto">
        {selectedDateMeetings.length > 0 ? (
          selectedDateMeetings.map((meeting: any) => (
            <div
              key={meeting?._id}
              className={`border rounded-lg p-4 hover:shadow-md transition-all duration-200 bg-white ${
                meeting.status === "cancelled"
                  ? "border-gray-200 bg-gray-50 opacity-75"
                  : meeting.status === "completed"
                  ? "border-green-200"
                  : "border-gray-100"
              }`}
            >
              {/* Title and Action Buttons Row */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-800 text-base">
                      {meeting.title}
                    </h4>
                    {/* Status Badge */}
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                        meeting.status === "upcoming"
                          ? "bg-blue-100 text-blue-700"
                          : meeting.status === "ongoing"
                          ? "bg-purple-100 text-purple-700"
                          : meeting.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {meeting.status || "upcoming"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Edit Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditMeeting?.(meeting);
                    }}
                    className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                    title="Edit meeting"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Are you sure you want to delete "${meeting.title}"?`)) {
                        onDeleteMeeting?.(meeting._id);
                      }
                    }}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                    title="Delete meeting"
                  >
                    <FiTrash2 size={16} />
                  </button>
                  {/* Join Button */}
                  {meeting.meetingLink &&
                    meeting.status !== "cancelled" &&
                    meeting.status !== "completed" && (
                      <a
                        href={meeting.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-10 text-white text-sm rounded-lg hover:bg-primary-20 transition"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FiVideo size={14} />
                        Join
                      </a>
                    )}
                </div>
              </div>

              {/* Time */}
             <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
  <FiClock size={14} />
  <span>
    {convertTo12HourFormat(meeting.startTime)} - {convertTo12HourFormat(meeting.endTime)}
  </span>
</div>

              {/* Description */}
              {meeting.description && (
                <div className="mb-3">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {meeting.description}
                  </p>
                </div>
              )}

              {/* Attendees */}
              {meeting.attendees && meeting.attendees.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <FiUsers size={14} />
                    <span className="text-xs text-gray-500">Attendees:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {meeting.attendees.map((attendee: any, idx: number) => (
                      <span
                        key={idx}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                      >
                        {typeof attendee === "string" ? attendee : attendee.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Status Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                {meeting.status !== "completed" &&
                  meeting.status !== "cancelled" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStatusChange?.(meeting._id, "completed");
                      }}
                      className="text-xs px-2 py-1 rounded bg-green-50 text-green-600 hover:bg-green-100 transition"
                    >
                      Mark Completed
                    </button>
                  )}
                {meeting.status !== "cancelled" &&
                  meeting.status !== "completed" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStatusChange?.(meeting._id, "cancelled");
                      }}
                      className="text-xs px-2 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100 transition"
                    >
                      Cancel
                    </button>
                  )}
                {meeting.status === "cancelled" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStatusChange?.(meeting._id, "upcoming");
                    }}
                    className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                  >
                    Restore Meeting
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <FiCalendar size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">No meetings scheduled</p>
            <p className="text-xs text-gray-400 mt-1">
              Click "Add Meeting" to create one
            </p>
          </div>
        )}
      </div>

      {/* Meeting Count */}
      {selectedDateMeetings.length > 0 && (
        <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
          <p className="text-xs text-gray-500 text-center">
            {selectedDateMeetings.length} meeting
            {selectedDateMeetings.length !== 1 ? "s" : ""} scheduled for today
          </p>
        </div>
      )}
    </div>
  );
};

export default MeetingsList;