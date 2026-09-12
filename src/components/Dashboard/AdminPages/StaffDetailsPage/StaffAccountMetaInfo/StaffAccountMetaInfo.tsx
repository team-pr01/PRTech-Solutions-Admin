/* eslint-disable @typescript-eslint/no-explicit-any */
import { FiCalendar } from "react-icons/fi";
import { formatDate } from "../../../../../utils/formatDate";

const StaffAccountMetaInfo = ({
  metaInfo,
}: {
  metaInfo: {
    createdAt: string;
    passwordChangedAt: string;
  };
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-50/60 overflow-hidden">
      <div className="px-6 py-4 border-b border-neutral-50/50 flex items-center gap-3">
        <div className="p-2 bg-neutral-50/40 rounded-lg">
          <FiCalendar className="text-neutral-30" size={18} />
        </div>
        <h2 className="font-semibold text-neutral-10">Account Information</h2>
      </div>
      <div className="p-6 space-y-3 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-neutral-30">Created On</span>
          <span className="text-neutral-10 font-medium">
            {formatDate(metaInfo?.createdAt as any)}
          </span>
        </div>
        {metaInfo?.passwordChangedAt && (
          <div className="flex justify-between items-center">
            <span className="text-neutral-30">Password Changed</span>
            <span className="text-neutral-10 font-medium">
              {formatDate(metaInfo?.passwordChangedAt as any)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffAccountMetaInfo;
