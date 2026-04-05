/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, useNavigate } from "react-router-dom";
import {
  FiCalendar,
  FiMapPin,
  FiGlobe,
  FiMessageSquare,
  FiClock,
  FiUser,
  FiBriefcase,
  FiLink,
  FiArrowLeft,
} from "react-icons/fi";
import {
  FaWhatsapp,
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaStar,
} from "react-icons/fa";
import { useGetSingleLeadByIdQuery } from "../../../redux/Features/Lead/leadApi";
import { formatDate } from "../../../utils/formatDate";

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGetSingleLeadByIdQuery(id!);

  const lead = data?.data;

  // Status badge color
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Pending: "bg-yellow-100 text-yellow-700",
      Ongoing: "bg-blue-100 text-blue-700",
      "Discovery Call Scheduled": "bg-purple-100 text-purple-700",
      Closed: "bg-green-100 text-green-700",
      "Not Interested": "bg-red-100 text-red-700",
      "For Future": "bg-gray-100 text-gray-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  // Priority style
  const getPriorityColor = (priority: number) => {
    if (priority === 1) return "bg-red-100 text-red-700";
    if (priority === 2) return "bg-orange-100 text-orange-700";
    if (priority === 3) return "bg-yellow-100 text-yellow-700";
    if (priority === 4) return "bg-blue-100 text-blue-700";
    return "bg-gray-100 text-gray-700";
  };

  const getPriorityLabel = (priority: number) => {
    if (priority === 1) return "Highest";
    if (priority === 2) return "High";
    if (priority === 3) return "Medium";
    if (priority === 4) return "Low";
    return "Lowest";
  };

  // Get social media icon
  const getSocialMediaIcon = (platform: string) => {
    const icons: Record<string, any> = {
      LinkedIn: <FaLinkedin className="text-blue-600" size={18} />,
      Twitter: <FaTwitter className="text-blue-400" size={18} />,
      Facebook: <FaFacebook className="text-blue-700" size={18} />,
      Instagram: <FaInstagram className="text-pink-600" size={18} />,
      YouTube: <FaYoutube className="text-red-600" size={18} />,
      TikTok: <FaStar className="text-black" size={18} />,
    };
    return icons[platform] || <FiLink size={18} />;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-10"></div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Lead not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => navigate("/dashboard/admin/leads")}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <FiArrowLeft size={20} />
              </button>
              <h1 className="text-2xl font-bold text-gray-800">
                {lead.businessName}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  lead.status,
                )}`}
              >
                {lead.status}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(lead.priority)}`}
              >
                Priority {lead.priority} ({getPriorityLabel(lead.priority)})
              </span>
            </div>
            {lead.issueFound && (
              <p className="text-gray-600 max-w-3xl">
                <span className="font-medium">Issue:</span> {lead.issueFound}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Owner Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiUser className="text-primary-10" />
              Owner Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium text-gray-800">{lead.ownerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Contact Number</p>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-800">
                    {lead.ownerContactNumber}
                  </p>
                  {lead.isWhatsapp && (
                    <FaWhatsapp className="text-green-500" size={18} />
                  )}
                </div>
              </div>
              {lead.ownerEmail && (
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-800">{lead.ownerEmail}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">Business Contact</p>
                <p className="font-medium text-gray-800">
                  {lead.businessContactNumber}
                </p>
              </div>
            </div>
          </div>

          {/* Discovery Call Section */}
          {lead.discoveryCallScheduledDate && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiCalendar className="text-primary-10" />
                Discovery Call
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <FiCalendar size={14} className="text-gray-400" />
                    <span className="text-gray-700">
                      {formatDate(lead.discoveryCallScheduledDate)}
                    </span>
                  </div>
                  {lead.discoveryCallScheduledTime && (
                    <div className="flex items-center gap-2">
                      <FiClock size={14} className="text-gray-400" />
                      <span className="text-gray-700">
                        {lead.discoveryCallScheduledTime}
                      </span>
                    </div>
                  )}
                </div>
                {lead.discoveryCallNotes && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      {lead.discoveryCallNotes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Follow Ups Summary */}
          {lead.followUps && lead.followUps.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <FiClock className="text-primary-10" />
                Follow Ups ({lead.followUps.length})
              </h2>
              <div className="space-y-3">
                {lead.followUps.map((followUp: any) => (
                  <div
                    key={followUp._id}
                    className="border-l-4 border-primary-10 px-4 py-2 bg-gray-50 rounded-r-lg"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {followUp.key}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {followUp.response || "No response recorded"}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500">
                        {formatDate(followUp.followUpDate)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - 1 column */}
        <div className="space-y-6">
          {/* Lead Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiBriefcase className="text-primary-10" />
              Lead Details
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium text-gray-800">{lead.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Lead Source</p>
                <p className="font-medium text-gray-800">
                  {lead.leadSource || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Next Action</p>
                <p className="font-medium text-gray-800">
                  {lead.nextAction || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiMapPin className="text-primary-10" />
              Location
            </h2>
            <div className="space-y-2">
              <p className="text-gray-800">
                <span className="font-medium">Country:</span> {lead.country}
              </p>
              {lead.city && (
                <p className="text-gray-800">
                  <span className="font-medium">City:</span> {lead.city}
                </p>
              )}
              {lead.address && (
                <p className="text-gray-600 text-sm">
                  <span className="font-medium">Address:</span> {lead.address}
                </p>
              )}
            </div>
          </div>

          {/* Social Media */}
          {lead.socialMedia && lead.socialMedia.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiGlobe className="text-primary-10" />
                Social Media
              </h2>
              <div className="space-y-2">
                {lead.socialMedia.map((social: any, index: number) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary-10 hover:underline"
                  >
                    {getSocialMediaIcon(social.platform)}
                    <span>{social.platform}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Website */}
          {lead.website && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiLink className="text-primary-10" />
                Website
              </h2>
              <a
                href={lead.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-10 hover:underline break-all"
              >
                {lead.website}
              </a>
            </div>
          )}

          {/* Notes */}
          {lead.notes && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiMessageSquare className="text-primary-10" />
                Notes
              </h2>
              <p className="text-gray-600 whitespace-pre-wrap">{lead.notes}</p>
            </div>
          )}

          {/* Metadata */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiCalendar className="text-primary-10" />
              Metadata
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Created At</span>
                <span className="text-gray-800">
                  {formatDate(lead.createdAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated</span>
                <span className="text-gray-800">
                  {formatDate(lead.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetails;
