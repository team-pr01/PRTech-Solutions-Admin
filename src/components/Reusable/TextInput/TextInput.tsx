/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef } from "react";
import type { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

interface TextInputProps {
  label?: string;
  name: string;
  placeholder?: string;
  type?: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: any;
  isDisabled?: boolean;
  isRequired?: boolean;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      label,
      name,
      placeholder = "",
      type = "text",
      error,
      defaultValue,
      isDisabled = false,
      isRequired = true,
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
            <span className="text-neutral-10 leading-[18px] text-[15px] font-medium tracking-[-0.16]">
              {label} <span className="text-primary-10">{isRequired ? "*" : ""}</span>
            </span>
          </label>
        )}
        <input
          // required={isRequired}
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          defaultValue={defaultValue}
          ref={ref}
          disabled={isDisabled}
          className={`w-full px-4 py-[14px] rounded-lg  border leading-[18px] focus:outline-none focus:border-primary-10 transition duration-300 ${isDisabled ? "cursor-not-allowed bg-neutral-50/20" : "bg-white"} ${
            error ? "border-red-500" : "border-neutral-45/20"
          }`}
          {...rest}
        />
        {error?.message && (
          <span className="text-red-500 text-sm mt-1">{String(error.message)}</span>
        )}
      </div>
    );
  }
);

TextInput.displayName = "TextInput";

export default TextInput;
