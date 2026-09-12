/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiUpload, FiX, FiCheckCircle } from "react-icons/fi";
import { IMAGES } from "../../assets";
import TextInput from "../../components/Reusable/TextInput/TextInput";
import SelectDropdownWithSearch from "../../components/Reusable/SelectDropdownWithSearch/SelectDropdownWithSearch";
import Textarea from "../../components/Reusable/TextArea/TextArea";
import Button from "../../components/Reusable/Button/Button";
import PasswordInput from "../../components/Reusable/PasswordInput/PasswordInput";
import { useSignupMutation } from "../../redux/Features/Auth/authApi";

type TFormData = {
  name: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  gender: string;
  country: string;
  city: string;
  pincode: string;
  address: string;
  whatsappNumber: string;
  bankPhoneNumber: string;
  bankName: string;
  bankAccountNumber: string;
  ifscCode: string;
  password: string;
};

const StaffForm = () => {
  const [signup, { isLoading }] = useSignupMutation();
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [panFront, setPanFront] = useState<File | null>(null);
  const [panBack, setPanBack] = useState<File | null>(null);
  const [employeeImage, setEmployeeImage] = useState<File | null>(null);

  const [panFrontPreview, setPanFrontPreview] = useState<string>("");
  const [panBackPreview, setPanBackPreview] = useState<string>("");
  const [employeeImagePreview, setEmployeeImagePreview] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TFormData>();

  // Handle image selection with preview
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: (file: File | null) => void,
    setPreview: (preview: string) => void,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Remove image
  const removeImage = (
    setFile: (file: File | null) => void,
    setPreview: (preview: string) => void,
  ) => {
    setFile(null);
    setPreview("");
  };

  const handleSubmitStaffDetails = async (data: TFormData) => {
    // Validate mandatory images
    if (!panFront || !panBack || !employeeImage) {
      toast.error(
        "Please upload all required images (PAN front, PAN back, and your photo).",
      );
      return;
    }

    try {
      const formData = new FormData();

      // Append text fields
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append("role", "staff");

      // Append images
      formData.append("panCardFrontImage", panFront);
      formData.append("panCardBackImage", panBack);
      formData.append("avatar", employeeImage);

      const res = await signup(formData).unwrap();
      if (res?.success) {
        toast.success("Your details have been submitted successfully!");
        reset();
        setSelectedGender("");
        setPanFront(null);
        setPanBack(null);
        setEmployeeImage(null);
        setPanFrontPreview("");
        setPanBackPreview("");
        setEmployeeImagePreview("");
      }
    } catch (error: any) {
        console.log(error);
      toast.error(
        error?.data?.message || "Submission failed. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 py-10 px-4 font-Nunito">
      <form
        onSubmit={handleSubmit(handleSubmitStaffDetails)}
        className="w-full max-w-4xl mx-auto bg-white shadow-2xl border-2 border-neutral-50/40 rounded-lg overflow-hidden"
      >
        {/* Paper Header */}
        <div className="relative border-b-4 border-double border-primary-10/30 bg-gradient-to-r from-primary-10/5 via-white to-primary-10/5 py-8 px-8">
          <img src={IMAGES.logo} alt="Logo" className="w-39 mx-auto" />

          <div className="text-center mt-6">
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-65 tracking-wide">
              Employee Information
            </h1>
            <p className="text-sm text-neutral-45/70 mt-2 tracking-widest uppercase">
              Employee Onboarding · PRTech Solutions
            </p>
          </div>

          <div className="mt-6 p-4 bg-amber-50 border-l-4 border-amber-400 rounded">
            <p className="text-sm text-amber-800 font-medium flex items-start gap-2">
              <span className="text-lg leading-none">⚠️</span>
              <span>
                <strong>Important:</strong> All information provided below must
                strictly match your <strong>PAN Card</strong>. Any mismatch may
                cause issues during verification.
              </span>
            </p>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 md:p-10 space-y-8">
          {/* SECTION: Personal Information */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px flex-1 bg-neutral-50"></div>
              <h2 className="text-sm font-bold text-primary-10 uppercase tracking-wider">
                Personal Information
              </h2>
              <div className="h-px flex-1 bg-neutral-50"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <TextInput
                label="Full Name (as per PAN)"
                placeholder="Enter your full name"
                error={errors.name}
                {...register("name", {
                  required: "Name is required",
                })}
              />

              <TextInput
                label="Email Address"
                placeholder="Enter your email"
                type="email"
                error={errors.email}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
              />

              {/* Country Code + Phone Number in one row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <TextInput
                    label="Code"
                    placeholder="+91"
                    error={errors.countryCode}
                    {...register("countryCode", {
                      required: "Required",
                    })}
                  />
                </div>
                <div className="col-span-2">
                  <TextInput
                    label="Phone Number"
                    placeholder="Enter your phone number"
                    type="tel"
                    error={errors.phoneNumber}
                    {...register("phoneNumber", {
                      required: "Phone number is required",
                    })}
                  />
                </div>
              </div>

              <SelectDropdownWithSearch
                label="Gender"
                name="gender"
                value={selectedGender}
                options={["male", "female"]}
                onChange={(value) => {
                  setSelectedGender(value);
                  setValue("gender", value);
                }}
                isRequired={true}
              />
            </div>
          </section>

          {/* SECTION: Address Details */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px flex-1 bg-neutral-50"></div>
              <h2 className="text-sm font-bold text-primary-10 uppercase tracking-wider">
                Address Details (as per PAN)
              </h2>
              <div className="h-px flex-1 bg-neutral-50"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <TextInput
                label="Country"
                placeholder="Enter your country"
                error={errors.country}
                {...register("country", {
                  required: "Country is required",
                })}
              />

              <TextInput
                label="City"
                placeholder="Enter your city"
                error={errors.city}
                {...register("city", {
                  required: "City is required",
                })}
              />

              <TextInput
                label="Pincode"
                placeholder="Enter your pincode"
                error={errors.pincode}
                {...register("pincode", {
                  required: "Pincode is required",
                })}
              />
            </div>

            <div className="mt-5">
              <Textarea
                label="Full Address (as per PAN)"
                placeholder="Enter your complete address as mentioned in your PAN card"
                error={errors.address}
                {...register("address", {
                  required: "Address is required",
                })}
                rows={3}
              />
            </div>
          </section>

          {/* SECTION: Contact Details */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px flex-1 bg-neutral-50"></div>
              <h2 className="text-sm font-bold text-primary-10 uppercase tracking-wider">
                Contact Details
              </h2>
              <div className="h-px flex-1 bg-neutral-50"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <TextInput
                label="WhatsApp Number"
                placeholder="e.g. +91 1234567890"
                type="tel"
                error={errors.whatsappNumber}
                {...register("whatsappNumber", {
                  required: "WhatsApp number is required",
                })}
              />

              <TextInput
                label="Bank Registered Phone Number"
                placeholder="Phone number linked to bank account e.g. +91 1234567890"
                type="tel"
                error={errors.bankPhoneNumber}
                {...register("bankPhoneNumber", {
                  required: "Bank phone number is required",
                })}
              />
            </div>
          </section>

          {/* SECTION: Bank Account Details */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px flex-1 bg-neutral-50"></div>
              <h2 className="text-sm font-bold text-primary-10 uppercase tracking-wider">
                Bank Account Details
              </h2>
              <div className="h-px flex-1 bg-neutral-50"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <TextInput
                label="Bank Name"
                placeholder="e.g., State Bank of India"
                error={errors.bankName}
                {...register("bankName", {
                  required: "Bank name is required",
                })}
              />

              <TextInput
                label="Bank Account Number"
                placeholder="Enter account number"
                error={errors.bankAccountNumber}
                {...register("bankAccountNumber", {
                  required: "Bank account number is required",
                })}
              />

              <TextInput
                label="IFSC Code"
                placeholder="e.g., SBIN0001234"
                error={errors.ifscCode}
                {...register("ifscCode", {
                  required: "IFSC code is required",
                  pattern: {
                    value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                    message: "Invalid IFSC code format",
                  },
                })}
              />
            </div>
          </section>

          {/* SECTION: Document Uploads */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px flex-1 bg-neutral-50"></div>
              <h2 className="text-sm font-bold text-primary-10 uppercase tracking-wider">
                Document Uploads
              </h2>
              <div className="h-px flex-1 bg-neutral-50"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* PAN Front */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-65">
                  PAN Card (Front) <span className="text-red-500">*</span>
                </label>
                {panFrontPreview ? (
                  <div className="relative group">
                    <img
                      src={panFrontPreview}
                      alt="PAN Front"
                      className="w-full h-40 object-cover rounded-lg border-2 border-green-200"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <div className="bg-green-500 text-white rounded-full p-1">
                        <FiCheckCircle size={16} />
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          removeImage(setPanFront, setPanFrontPreview)
                        }
                        className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-neutral-50 rounded-lg cursor-pointer hover:border-primary-10 hover:bg-primary-10/5 transition">
                    <FiUpload className="text-neutral-50 text-2xl mb-2" />
                    <span className="text-xs text-neutral-50">
                      Click to upload
                    </span>
                    <span className="text-xs text-neutral-50 mt-1">
                      JPG, PNG (Max 5MB)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleImageChange(e, setPanFront, setPanFrontPreview)
                      }
                    />
                  </label>
                )}
              </div>

              {/* PAN Back */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-65">
                  PAN Card (Back) <span className="text-red-500">*</span>
                </label>
                {panBackPreview ? (
                  <div className="relative group">
                    <img
                      src={panBackPreview}
                      alt="PAN Back"
                      className="w-full h-40 object-cover rounded-lg border-2 border-green-200"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <div className="bg-green-500 text-white rounded-full p-1">
                        <FiCheckCircle size={16} />
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          removeImage(setPanBack, setPanBackPreview)
                        }
                        className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-neutral-50 rounded-lg cursor-pointer hover:border-primary-10 hover:bg-primary-10/5 transition">
                    <FiUpload className="text-neutral-50 text-2xl mb-2" />
                    <span className="text-xs text-neutral-50">
                      Click to upload
                    </span>
                    <span className="text-xs text-neutral-50 mt-1">
                      JPG, PNG (Max 5MB)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleImageChange(e, setPanBack, setPanBackPreview)
                      }
                    />
                  </label>
                )}
              </div>

              {/* Employee Image */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-65">
                  Your Photo <span className="text-red-500">*</span>
                </label>
                {employeeImagePreview ? (
                  <div className="relative group">
                    <img
                      src={employeeImagePreview}
                      alt="Employee"
                      className="w-full h-40 object-cover rounded-lg border-2 border-green-200"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <div className="bg-green-500 text-white rounded-full p-1">
                        <FiCheckCircle size={16} />
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          removeImage(setEmployeeImage, setEmployeeImagePreview)
                        }
                        className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-neutral-50 rounded-lg cursor-pointer hover:border-primary-10 hover:bg-primary-10/5 transition">
                    <FiUpload className="text-neutral-50 text-2xl mb-2" />
                    <span className="text-xs text-neutral-50">
                      Click to upload
                    </span>
                    <span className="text-xs text-neutral-50 mt-1">
                      JPG, PNG (Max 5MB)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleImageChange(
                          e,
                          setEmployeeImage,
                          setEmployeeImagePreview,
                        )
                      }
                    />
                  </label>
                )}
              </div>
            </div>
          </section>

          {/* SECTION: Password */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px flex-1 bg-neutral-50"></div>
              <h2 className="text-sm font-bold text-primary-10 uppercase tracking-wider">
                Password
              </h2>
              <div className="h-px flex-1 bg-neutral-50"></div>
            </div>

            {/* Info box about password */}
            <div className="mb-5 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
              <p className="text-sm text-blue-800 font-medium flex items-start gap-2">
                <span className="text-lg leading-none">🔐</span>
                <span>
                  <strong>Note:</strong> This password will be used when you log
                  in to your portal. Please choose a strong password and keep it
                  safe.
                </span>
              </p>
            </div>

            <PasswordInput
              label="Password"
              placeholder="Must be at least 8 Characters"
              error={errors.password}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              isPasswordVisible={isPasswordVisible}
              setIsPasswordVisible={setIsPasswordVisible}
            />
          </section>

          {/* Declaration */}
          <div className="bg-neutral-50/20 border border-neutral-50/40 rounded-lg p-5">
            <h3 className="text-sm font-bold text-neutral-65 mb-2 uppercase tracking-wider">
              Declaration
            </h3>
            <p className="text-xs text-neutral-45 leading-relaxed">
              I hereby declare that all the information provided above is true,
              complete, and correct to the best of my knowledge and belief. All
              details are strictly as per my PAN Card, and I understand that any
              false information may lead to termination of my employment.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4 border-t-2 border-dashed border-neutral-50/40">
            <Button
              type="submit"
              label="Submit Details"
              variant="primary"
              className="py-2.5 px-8 w-full md:w-fit text-base font-semibold"
              isLoading={isLoading}
              isDisabled={isLoading}
            />
          </div>
        </div>

        {/* Paper Footer */}
        <div className="bg-gradient-to-r from-primary-10/5 via-white to-primary-10/5 border-t border-neutral-50/30 py-4 px-8">
          <p className="text-center text-xs text-neutral-45">
            PRTech Solutions — Confidential Employee Information Form
          </p>
        </div>
      </form>
    </div>
  );
};

export default StaffForm;
