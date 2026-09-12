/* eslint-disable @typescript-eslint/no-explicit-any */
import { FaWhatsapp } from "react-icons/fa";
import {
  FiBriefcase,
  FiCalendar,
  FiCheckCircle,
  FiCopy,
  FiHash,
  FiMail,
  FiPhone,
  FiSlash,
  FiXCircle,
} from "react-icons/fi";
import { formatDate } from "../../../../../utils/formatDate";
import toast from "react-hot-toast";
import type { TUser } from "../../../../../types/user.types";

const StaffBasicInfo = ({ staff }: { staff: TUser }) => {
  // Copy to clipboard
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  // Get initials
  const getInitials = (name: string) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-neutral-50/60 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center gap-6 p-6 md:p-8">
        {/* Avatar */}
        <div className="relative">
          {staff.avatar ? (
            <img
              src={staff.avatar}
              alt={staff.name}
              className="w-28 h-28 md:w-36 md:h-36 rounded-2xl object-cover border-4 border-white shadow-xl"
            />
          ) : (
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-gradient-to-br from-primary-10 to-secondary-10 flex items-center justify-center border-4 border-white shadow-xl">
              <span className="text-white text-3xl md:text-4xl font-bold">
                {getInitials(staff.name)}
              </span>
            </div>
          )}
          {/* Status indicator */}
          <div
            className={`absolute bottom-2 right-2 w-5 h-5 rounded-full border-2 border-white ${
              staff.isSuspended ? "bg-accent-10" : "bg-green-500"
            }`}
            title={staff.isSuspended ? "Suspended" : "Active"}
          ></div>
        </div>

        {/* Basic Info */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-10">
              {staff.name}
            </h1>
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium w-fit mx-auto md:mx-0 capitalize ${
                staff.role === "admin"
                  ? "bg-primary-10/10 text-primary-10"
                  : staff.role === "staff"
                    ? "bg-secondary-10/10 text-secondary-10"
                    : "bg-neutral-50 text-neutral-30"
              }`}
            >
              <FiBriefcase size={12} />
              {staff.jobRole || staff.role}
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 mt-2 text-sm text-neutral-30">
            <div className="flex items-center gap-1">
              <FiHash size={14} />
              <span>{staff.userId}</span>
              <button
                onClick={() => copyToClipboard(staff.userId || "", "User ID")}
                className="ml-1 text-neutral-45 hover:text-primary-10 transition"
              >
                <FiCopy size={14} />
              </button>
            </div>
            <div className="hidden md:block w-px h-4 bg-neutral-50"></div>
            <div className="flex items-center gap-1">
              <FiCalendar size={14} />
              <span>Joined {formatDate(staff.createdAt as any)}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center justify-center md:justify-end gap-2">
          <a
            href={`mailto:${staff.email}`}
            className="p-3 bg-primary-10/5 text-neutral-20 rounded-xl hover:bg-primary-10 hover:text-white transition-all"
            title="Send Email"
          >
            <FiMail size={18} />
          </a>
          <a
            href={`tel:${staff.countryCode}${staff.phoneNumber}`}
            className="p-3 bg-primary-10/5 text-neutral-20 rounded-xl hover:bg-primary-10 hover:text-white transition-all"
            title="Call"
          >
            <FiPhone size={18} />
          </a>
          {staff.whatsappNumber && (
            <a
              href={`https://wa.me/${staff.whatsappNumber.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-primary-10/5 text-neutral-20 rounded-xl hover:bg-primary-10 hover:text-white transition-all"
              title="WhatsApp"
            >
              <FaWhatsapp size={18} />
            </a>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="px-6 md:px-8 py-3 bg-neutral-50/20 border-t border-neutral-50/50 flex flex-wrap items-center justify-between gap-4">
        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          {staff.isSuspended ? (
            <>
              <FiXCircle className="text-accent-10" size={16} />
              <span className="text-sm font-medium text-accent-10">
                Account Suspended
              </span>
            </>
          ) : (
            <>
              <FiCheckCircle className="text-green-600" size={16} />
              <span className="text-sm font-medium text-green-600">
                Active Account
              </span>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {staff.isSuspended ? (
            <button
              // onClick={handleWithdrawSuspension}
              // disabled={isUpdating}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 hover:border-green-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiCheckCircle size={16} />
              Withdraw Suspension
            </button>
          ) : (
            <button
              // onClick={handleSuspend}
              // disabled={isUpdating}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-accent-10 bg-accent-25 border border-accent-10/30 rounded-lg hover:bg-accent-10 hover:text-white hover:border-accent-10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiSlash size={16} />
              Suspend Account
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffBasicInfo;
