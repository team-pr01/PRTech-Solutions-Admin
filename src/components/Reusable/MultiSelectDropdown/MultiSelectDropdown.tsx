import { useState, useRef, useEffect, forwardRef } from "react";
import type { FieldError } from "react-hook-form";
import { FiChevronDown } from "react-icons/fi";

interface MultiSelectDropdownProps {
  label?: string;
  name: string;
  options: string[];
  placeholder?: string;
  error?: FieldError;
  value?: string[];
  onChange?: (selected: string[]) => void;
  isRequired?: boolean;
  isDisabled?: boolean;
  dropdownDirection?: string;
  noDataMessage?: string;
}

const MultiSelectDropdown = forwardRef<
  HTMLDivElement,
  MultiSelectDropdownProps
>(
  ({
    label,
    name,
    options,
    placeholder = "Select Options",
    error,
    value = [],
    onChange,
    isRequired = true,
    isDisabled,
    dropdownDirection = "bottom-full",
    noDataMessage = "No option found",
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValues, setSelectedValues] = useState<string[]>(value);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      setSelectedValues(value);
    }, [value]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    const toggleOption = (option: string) => {
      let newSelectedValues;
      if (selectedValues?.includes(option)) {
        newSelectedValues = selectedValues?.filter((item) => item !== option);
      } else {
        newSelectedValues = [...selectedValues, option];
      }
      setSelectedValues(newSelectedValues);
      onChange?.(newSelectedValues);
    };

    const filteredOptions = options.filter((option) =>
      option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const displayText =
      selectedValues?.length > 0 ? selectedValues?.join(", ") : placeholder;

    return (
      <div
        className="flex flex-col gap-2 font-Nunito capitalize"
        ref={dropdownRef}
      >
        {label && (
          <label
            htmlFor={name}
            className="flex flex-row items-center w-full justify-between text-neutral-65"
          >
            <p className="text-neutral-10 leading-[18px] text-[15px] font-medium tracking-[-0.16] ">
              {label}{" "}
              <span className="text-primary-10">{isRequired ? "*" : ""}</span>
            </p>
          </label>
        )}

        <div className="relative">
          <button
            type="button"
            disabled={isDisabled}
            className={`w-full px-4 py-[14px] rounded-lg border leading-[18px] focus:outline-none focus:border-primary-10 transition duration-300 text-left flex items-center justify-between ${
              error ? "border-red-500" : "border-neutral-45/20"
            } ${
              isDisabled
                ? "cursor-not-allowed bg-neutral-50/20"
                : "bg-white cursor-pointer"
            } ${
              selectedValues?.length === 0
                ? "text-neutral-55"
                : "text-neutral-10"
            }`}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className={`truncate capitalize`}>{displayText}</span>
            <FiChevronDown
              className={`transition-transform duration-200 ${
                isOpen ? "transform rotate-180" : ""
              }`}
              size={18}
            />
          </button>

          {isOpen && (
            <div
              className={`absolute z-50 ${dropdownDirection} mb-1 w-full rounded-lg bg-white shadow-lg border border-neutral-45/30 max-h-60 overflow-auto`}
            >
              {/* Search bar */}
              <div className="sticky top-0 bg-white p-2 border-b border-neutral-45/20">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full px-3 py-2 text-sm border border-primary-30 rounded-md focus:outline-none focus:border-primary-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div
                    key={option}
                    className={`px-4 py-2 cursor-pointer hover:bg-neutral-98 capitalize ${
                      selectedValues?.includes(option) ? "bg-neutral-98" : ""
                    }`}
                    onClick={() => toggleOption(option)}
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedValues?.includes(option)}
                        readOnly
                        className="mr-2 size-4 appearance-none rounded-full border border-neutral-95 checked:bg-primary-10 checked:border-primary-10 focus:ring-2 focus:ring-primary-10 capitalize"
                      />

                      <span className="text-neutral-10">{option}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-neutral-65 text-sm">
                  {noDataMessage}
                </div>
              )}
            </div>
          )}
        </div>

        {error && <span className="text-red-500 text-sm">{error.message}</span>}
      </div>
    );
  }
);

MultiSelectDropdown.displayName = "MultiSelectDropdown";

export default MultiSelectDropdown;
