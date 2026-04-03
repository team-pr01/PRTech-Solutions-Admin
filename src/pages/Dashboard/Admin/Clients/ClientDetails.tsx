/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router-dom";
import {
  useGetSingleClientByIdQuery,
  useDeleteSubordinateMutation,
} from "../../../../redux/Features/Client/clientApi";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiBriefcase,
  FiUsers,
  FiGlobe,
  FiClock,
  FiMessageSquare,
  FiTrash2,
  FiUserPlus,
  FiStar,
} from "react-icons/fi";
import { FaLinkedin, FaTwitter, FaFacebook } from "react-icons/fa";
import { formatDate } from "../../../../utils/formatDate";
import { toast } from "react-hot-toast";
import { useState } from "react";
import Modal from "../../../../components/Reusable/Modal/Modal";
import AddOrEditSubordinate from "../../../../components/Dashboard/AdminPages/ClientDetailsPage/AddOrEditSubordinate/AddOrEditSubordinate";
import { BiPencil } from "react-icons/bi";
import LogoLoader from "../../../../components/Reusable/LogoLoader/LogoLoader";

const ClientDetails = () => {
  const { id } = useParams();
  const { data, refetch } = useGetSingleClientByIdQuery(id!);
  const [selectedSubordinateId, setSelectedSubordinateId] = useState<
    string | null
  >(null);
  const [selectedSubordinate, setSelectedSubordinate] = useState<any>(null);
  const [modalType, setModalType] = useState<"add" | "edit">("add");
  const [deleteSubordinate] = useDeleteSubordinateMutation();
  const [isAddOrEditSubordinateModalOpen, setIsAddOrEditSubordinateModalOpen] =
    useState(false);

  const client = data?.data;

  const handleDeleteSubordinate = async (
    subordinateId: string,
    name: string,
  ) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await deleteSubordinate({ clientId: id!, subordinateId }).unwrap();
        toast.success("Subordinate deleted successfully");
        refetch();
      } catch (error: any) {
        toast.error(error.message || "Failed to delete subordinate");
      }
    }
  };

  // Get primary email
  const getPrimaryEmail = () => {
    const primary = client?.emails?.find((email: any) => email.isPrimary);
    return primary?.email || client?.emails?.[0]?.email;
  };

  // Get primary phone
  const getPrimaryPhone = () => {
    const primary = client?.phoneNumbers?.find((phone: any) => phone.isPrimary);
    if (primary) {
      return `${primary.countryCode} ${primary.phoneNumber}`;
    }
    return client?.phoneNumbers?.[0]
      ? `${client.phoneNumbers[0].countryCode} ${client.phoneNumbers[0].phoneNumber}`
      : null;
  };

  // Status badge color
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: "bg-green-100 text-green-700 border-green-200",
      inactive: "bg-gray-100 text-gray-700 border-gray-200",
      lead: "bg-blue-100 text-blue-700 border-blue-200",
      negotiation: "bg-yellow-100 text-yellow-700 border-yellow-200",
      former: "bg-red-100 text-red-700 border-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  if (!client) {
    return (
      <div className="flex justify-center items-center h-64">
       <LogoLoader/>
      </div>
    );
  }

  return (
    <div className="space-y-6 min-h-screen">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-800">
                {client.name}
              </h1>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {client.clientId}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                  client.status,
                )}`}
              >
                {client.status || "active"}
              </span>
            </div>
            <p className="text-gray-600 max-w-2xl">{client.notes}</p>
          </div>
          <button
            onClick={() => {
              setModalType("add");
              setIsAddOrEditSubordinateModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary-10 text-white rounded-lg hover:bg-primary-20 transition duration-300"
          >
            <FiUserPlus size={18} />
            Add Subordinate
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiMail className="text-primary-10" />
              Contact Information
            </h2>
            <div className="space-y-4">
              {/* Primary Contact */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center gap-2 mb-3">
                  <FiStar className="text-yellow-500" />
                  <h3 className="font-medium text-gray-800">Primary Contact</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <FiMail className="text-gray-400" />
                    <span className="text-gray-700">{getPrimaryEmail()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiPhone className="text-gray-400" />
                    <span className="text-gray-700">{getPrimaryPhone()}</span>
                  </div>
                </div>
              </div>

              {/* All Emails */}
              <div>
                <h3 className="font-medium text-gray-700 mb-2">All Emails</h3>
                <div className="space-y-2">
                  {client.emails?.map((email: any) => (
                    <div
                      key={email._id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <FiMail className="text-gray-400" />
                        <span>{email.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 capitalize">
                          {email.type}
                        </span>
                        {email.isPrimary && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                            Primary
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* All Phone Numbers */}
              <div>
                <h3 className="font-medium text-gray-700 mb-2">
                  Phone Numbers
                </h3>
                <div className="space-y-2">
                  {client.phoneNumbers?.map((phone: any) => (
                    <div
                      key={phone._id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <FiPhone className="text-gray-400" />
                        <span>
                          {phone.countryCode} {phone.phoneNumber}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 capitalize">
                          {phone.type}
                        </span>
                        {phone.isPrimary && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                            Primary
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Subordinates Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiUsers className="text-primary-10" />
              Subordinates & Partners
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                {client.subordinates?.length || 0}
              </span>
            </h2>
            {client.subordinates?.length > 0 ? (
              <div className="space-y-3">
                {client.subordinates.map((sub: any) => (
                  <div
                    key={sub._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-800">
                            {sub.name}
                          </h3>
                          {sub.designation && (
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                              {sub.designation}
                            </span>
                          )}
                        </div>
                        {sub.email && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FiMail size={14} />
                            <span>{sub.email}</span>
                          </div>
                        )}
                        {sub.phoneNumber?.phoneNumber && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FiPhone size={14} />
                            <span>
                              {sub.phoneNumber.countryCode}{" "}
                              {sub.phoneNumber.phoneNumber}
                            </span>
                          </div>
                        )}
                        {sub.notes && (
                          <div className="flex items-start gap-2 text-sm text-gray-500 mt-2">
                            <FiMessageSquare size={14} className="mt-0.5" />
                            <span>{sub.notes}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setModalType("edit");
                            setSelectedSubordinateId(sub?._id);
                            setSelectedSubordinate(sub);
                            setIsAddOrEditSubordinateModalOpen(true);
                          }}
                          title="Delete subordinate"
                        >
                          <BiPencil size={18} />
                        </button>

                        <button
                          onClick={() =>
                            handleDeleteSubordinate(sub._id, sub.name)
                          }
                          className="text-red-500 hover:text-red-700 transition"
                          title="Delete subordinate"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FiUsers className="mx-auto text-4xl mb-2" />
                <p>No subordinates added yet</p>
                <button
                  onClick={() => setIsAddOrEditSubordinateModalOpen(true)}
                  className="mt-2 text-primary-10 hover:underline"
                >
                  Add your first subordinate
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - 1 column */}
        <div className="space-y-6">
          {/* Business Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiBriefcase className="text-primary-10" />
              Business Details
            </h2>
            <div className="space-y-3">
              {client.industry && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Industry</span>
                  <span className="font-medium text-gray-800">
                    {client.industry}
                  </span>
                </div>
              )}
              {client.companySize && client.companySize !== "unknown" && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Company Size</span>
                  <span className="font-medium text-gray-800">
                    {client.companySize} employees
                  </span>
                </div>
              )}
              {client.source && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Source</span>
                  <span className="capitalize font-medium text-gray-800">
                    {client.source.replace(/_/g, " ")}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiMapPin className="text-primary-10" />
              Location
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <FiMapPin className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-gray-800">{client.country}</p>
                  {client.address && (
                    <p className="text-gray-600 text-sm mt-1">
                      {client.address}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Communication Preferences */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiMessageSquare className="text-primary-10" />
              Communication
            </h2>
            <div className="space-y-3">
              {client.preferredContactMethod && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Preferred Method</span>
                  <span className="capitalize font-medium text-gray-800">
                    {client.preferredContactMethod}
                  </span>
                </div>
              )}
              {client.languages && client.languages.length > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Languages</span>
                  <span className="font-medium text-gray-800">
                    {client.languages.join(", ")}
                  </span>
                </div>
              )}
              {client.timezone && (
                <div className="flex items-center gap-2 py-2">
                  <FiClock className="text-gray-400" />
                  <span className="text-gray-800">{client.timezone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Social Media */}
          {client.socialMedia &&
            (client.socialMedia.linkedin ||
              client.socialMedia.twitter ||
              client.socialMedia.facebook) && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FiGlobe className="text-primary-10" />
                  Social Media
                </h2>
                <div className="space-y-2">
                  {client.socialMedia.linkedin && (
                    <a
                      href={client.socialMedia.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                    >
                      <FaLinkedin size={18} />
                      <span>LinkedIn</span>
                    </a>
                  )}
                  {client.socialMedia.twitter && (
                    <a
                      href={client.socialMedia.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-500"
                    >
                      <FaTwitter size={18} />
                      <span>Twitter</span>
                    </a>
                  )}
                  {client.socialMedia.facebook && (
                    <a
                      href={client.socialMedia.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-700 hover:text-blue-800"
                    >
                      <FaFacebook size={18} />
                      <span>Facebook</span>
                    </a>
                  )}
                </div>
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
                  {formatDate(client.createdAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated</span>
                <span className="text-gray-800">
                  {formatDate(client.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        heading="Add Subordinate"
        isModalOpen={isAddOrEditSubordinateModalOpen}
        setIsModalOpen={setIsAddOrEditSubordinateModalOpen}
      >
        <AddOrEditSubordinate
          clientId={id as string}
          subordinateId={selectedSubordinateId as string}
          modalType={modalType}
          subordinateData={selectedSubordinate}
          onClose={() => setIsAddOrEditSubordinateModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default ClientDetails;
