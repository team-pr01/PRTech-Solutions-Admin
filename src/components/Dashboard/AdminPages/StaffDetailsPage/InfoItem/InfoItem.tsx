import React from "react";
import toast from "react-hot-toast";
import { FiCopy } from "react-icons/fi";

const InfoItem = ({
  label,
  value,
  icon,
  copyable = false,
  masked = false,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  copyable?: boolean;
  masked?: boolean;
}) => {
  const displayValue =
    masked && value.length > 4
      ? `${"•".repeat(Math.max(0, value.length - 4))}${value.slice(-4)}`
      : value;

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    toast.success(`${label} copied!`);
  };

  return (
    <div>
      <p className="text-xs font-medium text-neutral-30 uppercase tracking-wide mb-1.5">
        {label}
      </p>
      <div className="flex items-center gap-1">
        {icon && <span className="text-neutral-45">{icon}</span>}
        <p className="text-sm font-semibold text-neutral-10 break-all">
          {displayValue}
        </p>
        {copyable && value && value !== "N/A" && (
          <button
            onClick={handleCopy}
            className="text-neutral-45 hover:text-primary-10 transition ml-1"
            title="Copy"
          >
            <FiCopy size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export default InfoItem;
