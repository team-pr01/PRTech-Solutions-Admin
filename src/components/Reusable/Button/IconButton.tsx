import React from "react";

interface ButtonProps {
  label?: string;
  variant?: "primary"|"secondary" | "tertiary" |string;
  onClick?: () => void;
  icon?: React.ReactNode;
  iconBg?: string;
}

const variantClasses: Record<string, string> = {
  primary: "bg-neutral-40 py-2 px-5",
};

const IconButton: React.FC<ButtonProps> = ({
  variant = "primary",
  onClick,
  icon,
}) => {
  const variantClass = variantClasses[variant] || variantClasses["primary"];

  const baseClasses =
    "flex items-center gap-4 px-5  text-lg leading-[24px]  w-fit rounded-lg font-semibold";

  const combinedClasses = `${baseClasses} ${variantClass}`;

  return (
    <div className={`${variant?"relative":""}`}>
        
      <button onClick={onClick} className={combinedClasses}>
        
        {
          <img
              src={typeof icon === "string" ? icon : undefined}
              alt="Button Icon"
              className="w-[100px] h-[24px]"
            />
        }
      </button>
    </div>
  );
};

export default IconButton;
