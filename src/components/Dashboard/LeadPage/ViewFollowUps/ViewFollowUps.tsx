/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { FiCalendar, FiClock, FiMessageSquare, FiTrash2 } from "react-icons/fi";
import { formatDate } from "../../../../utils/formatDate";
import { useDeleteFollowUpMutation } from "../../../../redux/Features/Lead/leadApi";
import { toast } from "react-hot-toast";

type TFollowUp = {
  _id?: string;
  key: string;
  followUpDate: Date;
  response?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

type ViewFollowUpsProps = {
  leadId: string;
  followUps: TFollowUp[];
  onClose: () => void;
};

const ViewFollowUps = ({ leadId, followUps, onClose }: ViewFollowUpsProps) => {
  const [deleteFollowUp] = useDeleteFollowUpMutation();
  const [expandedFollowUp, setExpandedFollowUp] = useState<string | null>(null);
  const [deletingFollowUpId, setDeletingFollowUpId] = useState<string | null>(
    null,
  );

  // Sort follow ups by date (oldest first or newest first)
  const sortedFollowUps = [...followUps].sort(
    (a, b) =>
      new Date(a.followUpDate).getTime() - new Date(b.followUpDate).getTime(),
  );

  // Check if follow up is overdue
  const isOverdue = (followUpDate: Date) => {
    return new Date(followUpDate) < new Date();
  };

  // Check if follow up is today
  const isToday = (followUpDate: Date) => {
    const today = new Date();
    const followUp = new Date(followUpDate);
    return (
      followUp.getDate() === today.getDate() &&
      followUp.getMonth() === today.getMonth() &&
      followUp.getFullYear() === today.getFullYear()
    );
  };

  // Get status badge for follow up
  const getFollowUpStatus = (followUpDate: Date) => {
    if (isOverdue(followUpDate)) {
      return { label: "Overdue", color: "bg-red-100 text-red-700" };
    }
    if (isToday(followUpDate)) {
      return { label: "Today", color: "bg-yellow-100 text-yellow-700" };
    }
    return { label: "Upcoming", color: "bg-green-100 text-green-700" };
  };

  const handleDeleteFollowUp = async (
    followUpId: string,
    followUpKey: string,
  ) => {
    if (window.confirm(`Are you sure you want to delete "${followUpKey}"?`)) {
      setDeletingFollowUpId(followUpId);
      const response = await deleteFollowUp({ leadId, followUpId }).unwrap();

      if (response.success) {
        toast.success("Follow up deleted successfully");
        setDeletingFollowUpId(null);
        onClose();
      } else {
        toast.error("Failed to delete follow up");
      }
    }
  };

  if (!followUps || followUps.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <FiCalendar className="mx-auto text-4xl text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No Follow Ups
          </h3>
          <p className="text-gray-500">
            No follow ups have been scheduled for this lead yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Follow Ups Timeline */}
      <div className="space-y-4 mt-5">
        {sortedFollowUps.map((followUp, index) => {
          const status = getFollowUpStatus(followUp.followUpDate);
          const isExpanded = expandedFollowUp === followUp._id;
          const followUpDate = new Date(followUp.followUpDate);
          const isDeleting = deletingFollowUpId === followUp._id;

          return (
            <div
              key={followUp._id || index}
              className={`border rounded-lg p-4 transition-all duration-200 ${
                isOverdue(followUp.followUpDate)
                  ? "border-red-200 bg-red-50/30"
                  : isToday(followUp.followUpDate)
                    ? "border-yellow-200 bg-yellow-50/30"
                    : "border-gray-200 bg-white hover:shadow-md"
              } ${isDeleting ? "opacity-50" : ""}`}
            >
              {/* Follow Up Header */}
              <div>
                <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-gray-800">
                      {followUp.key}
                    </h4>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${status.color}`}
                    >
                      {status.label}
                    </span>
                    {index === followUps.length - 1 && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        Latest
                      </span>
                    )}
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() =>
                      handleDeleteFollowUp(followUp._id!, followUp.key)
                    }
                    disabled={isDeleting}
                    className="text-red-500 hover:text-red-700 transition p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete follow up"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>

                {/* Date and Time */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  <div className="flex items-center gap-1">
                    <FiCalendar size={14} className="text-gray-400" />
                    <span>{formatDate(followUp.followUpDate as any)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiClock size={14} className="text-gray-400" />
                    <span>
                      {followUpDate.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Response / Notes */}
              {followUp.response && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-start gap-2">
                    <FiMessageSquare
                      size={14}
                      className="text-gray-400 mt-0.5"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Response:
                      </p>
                      <p
                        className={`text-sm text-gray-600 ${
                          !isExpanded && followUp.response.length > 150
                            ? "line-clamp-2"
                            : ""
                        }`}
                      >
                        {followUp.response}
                      </p>
                      {followUp.response.length > 150 && (
                        <button
                          onClick={() =>
                            setExpandedFollowUp(
                              isExpanded ? null : followUp._id!,
                            )
                          }
                          className="text-xs text-primary-10 hover:underline mt-1"
                        >
                          {isExpanded ? "Show less" : "Read more"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Created At Timestamp */}
              {followUp.createdAt && (
                <div className="mt-2 text-xs text-gray-400">
                  Created: {formatDate(followUp.createdAt as any)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ViewFollowUps;
