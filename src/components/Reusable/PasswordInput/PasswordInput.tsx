/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef } from "react";
import type { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

interface PasswordInputProps {
  label?: string;
  name: string;
  placeholder?: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: any;
  isDisabled?: boolean;
  isRequired?: boolean;
  isPasswordVisible: boolean;
  setIsPasswordVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      label,
      name,
      placeholder = "",
      error,
      defaultValue,
      isDisabled = false,
      isRequired = true,
      isPasswordVisible,
      setIsPasswordVisible,
      ...rest
    },
    ref
  ) => {

    return (
      <div className="flex flex-col gap-2 font-Nunito w-full">
          {label && (
          <label
            htmlFor={name}
            className="flex flex-row items-center w-full justify-between text-neutral-65"
          >
            <span className="text-neutral-10 leading-[18px] text-[15px] font-medium tracking-[-0.16] ">
              {label} <span className="text-primary-10">{isRequired ? "*" : ""}</span>
            </span>
          </label>
        )}

        {/* Input + toggle icon */}
        <div className="relative w-full">
          <input
            id={name}
            name={name}
            type={isPasswordVisible ? "text" : "password"}
            placeholder={placeholder}
            defaultValue={defaultValue}
            ref={ref}
            disabled={isDisabled}
             className={`w-full px-4 py-[14px] rounded-lg bg-white border leading-[18px] focus:outline-none focus:border-primary-10 transition duration-300 ${
            error ? "border-red-500" : "border-neutral-45/20"
          }`}
            {...rest}
          />
          {isPasswordVisible ? (
            <IoEyeOffOutline
              onClick={() => setIsPasswordVisible(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-70 cursor-pointer text-primary-10"
            />
          ) : (
            <IoEyeOutline
              onClick={() => setIsPasswordVisible(true)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-70 cursor-pointer text-primary-10"
            />
          )}
        </div>

        {error?.message && (
          <span className="text-red-500 text-sm mt-1">{String(error.message)}</span>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
