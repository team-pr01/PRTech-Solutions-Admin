import { useState, useRef, useEffect, forwardRef } from "react";
import { FiChevronDown } from "react-icons/fi";

interface SingleSelectDropdownProps {
  label: string;
  name: string;
  options: string[];
  placeholder?: string;
  error?: string;
  value?: string | string[];
  onChange?: (selected: string) => void;
  isRequired?: boolean;
  dropdownDirection?: string;
}

const SelectDropdownWithSearch = forwardRef<
  HTMLDivElement,
  SingleSelectDropdownProps
>(
  ({
    label,
    name,
    options,
    placeholder = "Select Option",
    error,
    value = "",
    onChange,
    isRequired = true,
    dropdownDirection = "bottom-full",
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string>("");

    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Normalize incoming `value` (string | string[]) into a single string
    useEffect(() => {
      if (Array.isArray(value)) {
        setSelectedValue(value.length > 0 ? value[0] : "");
      } else if (typeof value === "string") {
        setSelectedValue(value);
      } else {
        setSelectedValue("");
      }
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

    const handleSelect = (option: string) => {
      setSelectedValue(option);
      onChange?.(option);
      setIsOpen(false);
    };

    const filteredOptions = options.filter((option) =>
      option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="flex flex-col gap-2 font-Nunito" ref={dropdownRef}>
        {label && (
          <label
            htmlFor={name}
            className="flex flex-row items-center justify-between text-neutral-65"
          >
            <p className="text-neutral-10 text-[15px] font-medium tracking-[-0.16px] leading-[18px]">
              {label}{" "}
              <span className="text-primary-10">{isRequired ? "*" : ""}</span>
            </p>
          </label>
        )}

        <div className="relative">
          <button
            type="button"
            className={`w-full px-4 py-[14px] rounded-lg bg-white border leading-[18px] focus:outline-none focus:border-primary-10 transition duration-300 text-left flex items-center justify-between cursor-pointer ${
              error ? "border-red-500" : "border-neutral-45/20"
            } ${!selectedValue ? "text-neutral-55" : "text-neutral-10"}`}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <span className="truncate capitalize">
              {selectedValue || placeholder}
            </span>
            <FiChevronDown
              className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              size={18}
            />
          </button>

          {isOpen && (
            <div className={`absolute z-30 ${dropdownDirection} mb-1 w-full rounded-lg bg-white shadow-lg border border-neutral-45/30 max-h-60 overflow-auto`}>
              {/* Search input */}
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
                      selectedValue === option ? "bg-neutral-98 font-medium" : ""
                    }`}
                    onClick={() => handleSelect(option)}
                  >
                    {option}
                  </div>
                ))
              ) : searchTerm.trim() === "" && !selectedValue ? (
                <div className="px-4 py-2 text-neutral-65 text-sm">
                  Please select city first
                </div>
              ) : (
                <div className="px-4 py-2 text-neutral-65 text-sm">
                  No location found
                </div>
              )}
            </div>
          )}
        </div>

        {error && <span className="text-red-500 text-sm">{error}</span>}
      </div>
    );
  }
);

SelectDropdownWithSearch.displayName = "SelectDropdownWithSearch";

export default SelectDropdownWithSearch;