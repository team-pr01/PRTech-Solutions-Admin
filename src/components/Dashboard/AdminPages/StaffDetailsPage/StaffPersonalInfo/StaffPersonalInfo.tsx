import { FaWhatsapp } from "react-icons/fa";
import { FiMail, FiPhone, FiUser } from "react-icons/fi";
import type { TUser } from "../../../../../types/user.types";
import InfoItem from "../InfoItem/InfoItem";

const StaffPersonalInfo = ({ staff }: { staff: TUser }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-50/60 overflow-hidden">
      <div className="px-6 py-4 border-b border-neutral-50/50 flex items-center gap-3">
        <div className="p-2 bg-primary-10/10 rounded-lg">
          <FiUser className="text-primary-10" size={18} />
        </div>
        <h2 className="font-semibold text-neutral-10">Personal Information</h2>
      </div>
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InfoItem label="Full Name" value={staff.name} />
        <InfoItem
          label="Email Address"
          value={staff.email}
          icon={<FiMail size={14} />}
          copyable
        />
        <InfoItem
          label="Phone Number"
          value={`${staff.countryCode} ${staff.phoneNumber}`}
          icon={<FiPhone size={14} />}
          copyable
        />
        <InfoItem label="Gender" value={staff.gender || "N/A"} />
        {staff.whatsappNumber && (
          <InfoItem
            label="WhatsApp Number"
            value={staff.whatsappNumber}
            icon={<FaWhatsapp size={14} className="text-green-600" />}
            copyable
          />
        )}
      </div>
    </div>
  );
};

export default StaffPersonalInfo;
