import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaIdBadge,
  FaBriefcase,
} from "react-icons/fa";
import { IMAGES } from "../../../../assets";
import { useGetMeQuery } from "../../../../redux/Features/User/userApi";
import LogoLoader from "../../../../components/Reusable/LogoLoader/LogoLoader";

const StaffProfile = () => {
  const { data, isLoading } = useGetMeQuery({});
  const myProfile = data?.data;
  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center font-Nunito">
        <LogoLoader />
      </div>
    );
  };
  
  return (
    <div className="max-w-4xl mx-auto font-Nunito">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header with background */}
        <div className="bg-primary-10 h-32 relative">
          <img
            src={IMAGES.logoWhiteVertical}
            alt=""
            className="w-24 absolute right-4 top-6"
          />
          <div className="absolute -bottom-16 left-8">
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-primary-20 to-primary-10 flex items-center justify-center">
              <FaUser className="text-white text-6xl" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-20 px-8 pb-8">
          {/* Name Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {myProfile?.userId?.name}
            </h1>
            <p className="text-lg text-gray-600 mt-1">{myProfile?.jobRole}</p>
          </div>

          {/* Profile Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-10 rounded-lg flex items-center justify-center">
                <FaEnvelope className="text-white text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Email Address
                </p>
                <a
                  href={`mailto:${myProfile?.userId?.email}`}
                  className="text-lg font-semibold text-gray-900 hover:text-primary-10 transition-colors text-wrap"
                >
                  {myProfile?.userId?.email}
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-10 rounded-lg flex items-center justify-center">
                <FaPhone className="text-white text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Phone Number
                </p>
                <a
                  href={`tel:${myProfile?.userId?.phoneNumber}`}
                  className="text-lg font-semibold text-gray-900 hover:text-primary-10 transition-colors"
                >
                  {myProfile?.userId?.phoneNumber}
                </a>
              </div>
            </div>

            {/* Staff ID */}
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-10 rounded-lg flex items-center justify-center">
                <FaIdBadge className="text-white text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Staff ID</p>
                <p className="text-lg font-semibold text-gray-900">
                  <span className="inline-block px-3 py-1 bg-primary-10/10 text-primary-10 font-bold rounded-full text-sm">
                    {myProfile?.staffId}
                  </span>
                </p>
              </div>
            </div>

            {/* Job Role */}
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-10 rounded-lg flex items-center justify-center">
                <FaBriefcase className="text-white text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Job Role</p>
                <p className="text-lg font-semibold text-gray-900">
                  {myProfile?.jobRole || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffProfile;
