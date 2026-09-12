import { FiGlobe, FiHome, FiMapPin } from "react-icons/fi";
import InfoItem from "../InfoItem/InfoItem";
import type { TUser } from "../../../../../types/user.types";

const StaffAddressInfo = ({address} : {address: Partial<TUser>}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-50/60 overflow-hidden">
      <div className="px-6 py-4 border-b border-neutral-50/50 flex items-center gap-3">
        <div className="p-2 bg-secondary-10/10 rounded-lg">
          <FiMapPin className="text-secondary-10" size={18} />
        </div>
        <h2 className="font-semibold text-neutral-10">Address</h2>
      </div>
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InfoItem
          label="Country"
          value={address?.country || "N/A"}
          icon={<FiGlobe size={14} />}
        />
        <InfoItem
          label="City"
          value={address?.city || "N/A"}
          icon={<FiHome size={14} />}
        />
        <InfoItem label="Pin Code" value={address?.pinCode || "N/A"} />
        <div className="sm:col-span-2">
          <InfoItem label="Full Address" value={address?.address || "N/A"} />
        </div>
      </div>
    </div>
  );
};

export default StaffAddressInfo;
