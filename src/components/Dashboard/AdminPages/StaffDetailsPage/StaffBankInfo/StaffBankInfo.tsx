/* eslint-disable @typescript-eslint/no-explicit-any */
import { FiCreditCard, FiPhone } from "react-icons/fi";
import InfoItem from "../InfoItem/InfoItem";

const StaffBankInfo = ({ bankInfo } : { bankInfo: any }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-50/60 overflow-hidden">
      <div className="px-6 py-4 border-b border-neutral-50/50 flex items-center gap-3">
        <div className="p-2 bg-accent-10/10 rounded-lg">
          <FiCreditCard className="text-accent-10" size={18} />
        </div>
        <h2 className="font-semibold text-neutral-10">Bank Account Details</h2>
      </div>
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InfoItem label="Bank Name" value={bankInfo?.bankName || "N/A"} />
        <InfoItem
          label="IFSC Code"
          value={bankInfo?.ifscCode || "N/A"}
          copyable
        />
        <div className="sm:col-span-2">
          <InfoItem
            label="Account Number"
            value={bankInfo?.bankAccountNumber || "N/A"}
            copyable
            masked
          />
        </div>
        {bankInfo?.bankPhoneNumber && (
          <div className="sm:col-span-2">
            <InfoItem
              label="Bank Registered Phone"
              value={bankInfo.bankPhoneNumber}
              icon={<FiPhone size={14} />}
              copyable
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffBankInfo;
