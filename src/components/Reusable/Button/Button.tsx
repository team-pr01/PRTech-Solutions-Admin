/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef } from "react";
import { twMerge } from "tailwind-merge";
import { ICONS } from "../../../assets";

interface ButtonProps {
  label?: any;
  variant?: "primary" | "secondary" | "tertiary" | "quaternary" | string;
  onClick?: any;
  icon?: React.ReactNode;
  iconBg?: string;
  className?: string;
  type?: "submit" | "reset" | "button";
  iconWithoutBg?: React.ReactNode;
  isDisabled?: boolean;
  isLoading?: boolean;
  animation?: boolean; // New prop to control animation
}

const variantClasses: Record<string, string> = {
  primary: "bg-primary-10 border border-primary-10 text-white",
  secondary: "bg-white text-black border border-black",
  tertiary:
    "bg-white text-primary-10 border border-primary-10 hover:bg-primary-10 hover:text-white",
  quaternary:
    "bg-primary-10 text-white border border-primary-10 hover:bg-white hover:text-primary-10",
};

const Button: React.FC<ButtonProps> = ({
  label,
  variant = "primary",
  onClick,
  icon,
  iconBg = "white",
  className = "",
  type = "button",
  iconWithoutBg,
  isDisabled,
  isLoading,
  animation = false,
}) => {
  const variantClass = variantClasses[variant] || variantClasses["primary"];
  const buttonRef = useRef<HTMLButtonElement>(null);

  const animationBaseClasses = animation
    ? "relative overflow-hidden group"
    : "";

  // Smoother continuous animation
  const animationOverlay = animation ? (
    <span className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[continuous-shimmer_3s_infinite_linear]"></span>
  ) : null;

  const animationStyles = animation ? (
    <style>
      {`
        @keyframes continuous-shimmer {
          0% {
            transform: translateX(-100%) skewX(-15deg);
          }
          100% {
            transform: translateX(200%) skewX(-15deg);
          }
        }
      `}
    </style>
  ) : null;

  const baseClasses = `flex items-center gap-2 text-lg leading-[24px] w-fit rounded-lg font-semibold font-Nunito transition-all duration-300 py-2 lg:py-3 px-3 lg:px-6 text-sm md:text-base ${
    isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
  } ${animationBaseClasses}`;

  const combinedClasses = twMerge(baseClasses, variantClass, className);

  return (
    <div className={variant ? "relative" : ""}>
      {animationStyles}
      <button
        ref={buttonRef}
        type={type}
        disabled={isDisabled || isLoading}
        onClick={onClick}
        className={combinedClasses}
      >
        {/* Animated gradient overlay */}
        {animationOverlay}

        {/* Content wrapper for proper z-index */}
        <span className="relative z-10 flex items-center gap-2">
          {isLoading ? (
            <img
              src={ICONS.loader}
              alt="Button Icon"
              className="size-4 md:size-5 lg:size-6 animate-spin"
            />
          ) : (
            ""
          )}
          {label}
          {!isLoading && icon && (
            <span
              className="rounded-full p-1 size-6 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
              style={{ backgroundColor: iconBg }}
            >
              <img
                src={typeof icon === "string" ? icon : undefined}
                alt="Button Icon"
                className="size-3 lg:size-4 transition-transform duration-300 group-hover:rotate-12"
              />
            </span>
          )}
          {!isLoading && iconWithoutBg && (
            <img
              src={
                typeof iconWithoutBg === "string" ? iconWithoutBg : undefined
              }
              alt="Button Icon"
              className="size-3 lg:size-4 transition-transform duration-300 group-hover:scale-110"
            />
          )}
        </span>
      </button>
    </div>
  );
};

export default Button;
