import { useParams, useNavigate } from "react-router-dom";
import { FiXCircle } from "react-icons/fi";
import { useGetSingleStaffByIdQuery } from "../../../../redux/Features/Staff/staffApi";
import StaffBasicInfo from "../../../../components/Dashboard/AdminPages/StaffDetailsPage/BasicInfo/StaffBasicInfo";
import StaffPersonalInfo from "../../../../components/Dashboard/AdminPages/StaffDetailsPage/StaffPersonalInfo/StaffPersonalInfo";
import StaffAddressInfo from "../../../../components/Dashboard/AdminPages/StaffDetailsPage/StaffAddressInfo/StaffAddressInfo";
import StaffBankInfo from "../../../../components/Dashboard/AdminPages/StaffDetailsPage/StaffBankInfo/StaffBankInfo";
import StaffPagesAssigned from "../../../../components/Dashboard/AdminPages/StaffDetailsPage/StaffPagesAssigned/StaffPagesAssigned";
import StaffPANCardInfo from "../../../../components/Dashboard/AdminPages/StaffDetailsPage/StaffPANCardInfo/StaffPANCardInfo";
import StaffAccountMetaInfo from "../../../../components/Dashboard/AdminPages/StaffDetailsPage/StaffAccountMetaInfo/StaffAccountMetaInfo";
import StaffProfileBanner from "../../../../components/Dashboard/AdminPages/StaffDetailsPage/StaffProfileBanner/StaffProfileBanner";

const StaffDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGetSingleStaffByIdQuery(id);
  const staff = data?.data;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50/20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-primary-10 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-neutral-30 text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="min-h-screen bg-neutral-50/20 flex items-center justify-center">
        <div className="text-center">
          <FiXCircle className="text-5xl text-accent-10 mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-neutral-20">
            Staff Not Found
          </h2>
          <p className="text-neutral-30 text-sm mt-1">
            The staff member you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-primary-10 text-white rounded-lg hover:bg-primary-10/90 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <StaffProfileBanner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <StaffBasicInfo staff={staff} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <StaffPersonalInfo staff={staff} />

            <StaffAddressInfo
              address={{
                country: staff.country,
                city: staff.city,
                pinCode: staff.pinCode,
                address: staff.address,
              }}
            />
            <StaffBankInfo bankInfo={staff?.bank} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <StaffPagesAssigned pagesAssigned={staff?.pagesAssigned} />

            <StaffPANCardInfo
              panCardInfo={{
                panCardFrontImage: staff.panCardFrontImage,
                panCardBackImage: staff.panCardBackImage,
              }}
            />

            <StaffAccountMetaInfo
              metaInfo={{
                createdAt: staff.createdAt,
                passwordChangedAt: staff.passwordChangedAt,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDetails;
