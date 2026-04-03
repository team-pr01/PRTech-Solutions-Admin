import React from "react";

interface NoDataProps {
  title?: string;
  description?: string;
  className?: string;
}

const NoData: React.FC<NoDataProps> = ({
  title = "No Data Found",
  description,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center ${className}`}
    >
      {/* Icon/Graphic */}
      <div className="flex items-center justify-center mb-4">
        <svg
          className="size-32 text-primary-10"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>

      {/* Title */}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>

      {/* Description */}
      <p className="text-sm text-gray-500 max-w-sm">{description}</p>
    </div>
  );
};

export default NoData;
