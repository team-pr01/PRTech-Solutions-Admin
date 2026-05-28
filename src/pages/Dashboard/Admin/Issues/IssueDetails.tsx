/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FiX,
  FiUser,
  FiMail,
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiLoader,
  FiXCircle,
  FiZoomIn,
  FiArrowLeft,
  FiArrowRight,
  FiMessageCircle,
  FiTrash2,
  FiImage,
} from "react-icons/fi";
import { formatDate } from "../../../../utils/formatDate";
import {
  useGetSingleIssueQuery,
  useDeleteIssueMutation,
} from "../../../../redux/Features/issues/issuesApi";
import { toast } from "react-hot-toast";
import Button from "../../../../components/Reusable/Button/Button";

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <FiClock size={16} />;
    case "ongoing":
      return <FiLoader size={16} />;
    case "resolved":
      return <FiCheckCircle size={16} />;
    case "closed":
      return <FiXCircle size={16} />;
    default:
      return <FiMessageCircle size={16} />;
  }
};

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "ongoing":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "resolved":
      return "bg-green-50 text-green-700 border-green-200";
    case "closed":
      return "bg-gray-50 text-gray-700 border-gray-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "urgent":
      return "bg-red-100 text-red-700";
    case "high":
      return "bg-orange-100 text-orange-700";
    case "medium":
      return "bg-yellow-100 text-yellow-700";
    case "low":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const IssueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGetSingleIssueQuery(id);
  const [deleteIssue] = useDeleteIssueMutation();
  const issue = data?.data || {};

  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsFullScreenOpen(true);
  };

  const handleNextImage = () => {
    if (
      selectedImageIndex !== null &&
      issue.images &&
      selectedImageIndex < issue.images.length - 1
    ) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const handlePrevImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this issue?")) {
      toast.promise(
        (async () => {
          await deleteIssue(id).unwrap();
          navigate("/dashboard/admin/issues");
        })(),
        {
          loading: "Deleting issue...",
          success: "Issue deleted successfully",
          error: "Failed to delete issue",
        },
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-10"></div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Content Section */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Status Banner */}
            <div
              className={`px-6 py-4 border-b ${getStatusBadgeClass(issue.status)}`}
            >
              <div className="flex items-center gap-2">
                {getStatusIcon(issue.status)}
                <span className="font-medium capitalize">
                  Status: {issue.status}
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Title */}
              <div className="pb-4 border-b border-gray-100">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Issue Title
                </label>
                <p className="text-gray-800 font-semibold text-xl mt-1">
                  {issue.title}
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Description
                </label>
                <p className="text-gray-700 mt-2 whitespace-pre-wrap leading-relaxed">
                  {issue.description}
                </p>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 border-y border-gray-100">
                <div>
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Priority
                  </label>
                  <div className="mt-2">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${getPriorityColor(issue.priority)}`}
                    >
                      {issue.priority}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Raised By
                  </label>
                  <div className="mt-2 space-y-1">
                    <p className="text-gray-800 flex items-center gap-2">
                      <FiUser size={14} className="text-gray-400" />
                      {issue.raisedBy?.name || "N/A"}
                    </p>
                    <p className="text-gray-500 text-sm flex items-center gap-2">
                      <FiMail size={14} className="text-gray-400" />
                      {issue.raisedBy?.email || "N/A"}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Created At
                  </label>
                  <p className="text-gray-800 mt-2 flex items-center gap-2">
                    <FiCalendar size={14} className="text-gray-400" />
                    {formatDate(issue.createdAt)}
                  </p>
                </div>

                {issue.resolvedAt && (
                  <div>
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Resolved At
                    </label>
                    <p className="text-green-600 mt-2 flex items-center gap-2">
                      <FiCheckCircle size={14} />
                      {formatDate(issue.resolvedAt)}
                    </p>
                  </div>
                )}
              </div>

              {/* Images Section */}
              {issue.images && issue.images.length > 0 && (
                <div>
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3 block">
                    Attachments ({issue.images.length})
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {issue.images.map((image: string, index: number) => (
                      <div
                        key={index}
                        className="relative group cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-gray-50 aspect-square"
                        onClick={() => handleImageClick(index)}
                      >
                        <img
                          src={image}
                          alt={`Attachment ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <FiZoomIn className="text-white" size={24} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Images Message */}
              {(!issue.images || issue.images.length === 0) && (
                <div className="bg-gray-50 rounded-lg p-8 text-center border border-dashed">
                  <FiImage size={32} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">No attachments</p>
                  <p className="text-sm text-gray-400">
                    No images were uploaded with this issue
                  </p>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-wrap justify-end gap-3">
              {/* Mark as Ongoing */}
              {issue.status !== "ongoing" &&
                issue.status !== "resolved" &&
                issue.status !== "closed" && (
                  <Button
                    variant="primary"
                    label="Mark as Ongoing"
                    icon={<FiLoader size={16} />}
                    // onClick={() => handleStatusUpdate("ongoing")}
                    className="!py-2"
                  />
                )}

              {/* Mark as Resolved */}
              {issue.status !== "resolved" && issue.status !== "closed" && (
                <Button
                  variant="success"
                  label="Mark as Resolved"
                  icon={<FiCheckCircle size={16} />}
                  // onClick={() => handleStatusUpdate("resolved")}
                  className="!py-2 bg-green-600 hover:bg-green-700"
                />
              )}

              {/* Mark as Closed */}
              {issue.status !== "closed" && (
                <Button
                  variant="secondary"
                  label="Mark as Closed"
                  icon={<FiXCircle size={16} />}
                  // onClick={() => handleStatusUpdate("closed")}
                  className="!py-2"
                />
              )}

              {/* Delete Button */}
              <Button
                variant="danger"
                label="Delete Issue"
                icon={<FiTrash2 size={16} />}
                onClick={handleDelete}
                className="!py-2"
              />

              {/* Back Button */}
              <Link to="/dashboard/admin/issues">
                <Button variant="secondary" label="Back to Issues" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Image Modal */}
      {isFullScreenOpen && selectedImageIndex !== null && issue.images && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50">
          <button
            onClick={() => setIsFullScreenOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition z-10"
          >
            <FiX size={32} />
          </button>

          {/* Previous Image Button */}
          {selectedImageIndex > 0 && (
            <button
              onClick={handlePrevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition bg-black/50 p-3 rounded-full hover:bg-black/70"
            >
              <FiArrowLeft size={28} />
            </button>
          )}

          {/* Next Image Button */}
          {selectedImageIndex < issue.images.length - 1 && (
            <button
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition bg-black/50 p-3 rounded-full hover:bg-black/70"
            >
              <FiArrowRight size={28} />
            </button>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full text-sm font-medium">
            {selectedImageIndex + 1} / {issue.images.length}
          </div>

          <img
            src={issue.images[selectedImageIndex]}
            alt="Full screen"
            className="max-w-[90vw] max-h-[90vh] object-contain"
          />
        </div>
      )}
    </>
  );
};

export default IssueDetails;
