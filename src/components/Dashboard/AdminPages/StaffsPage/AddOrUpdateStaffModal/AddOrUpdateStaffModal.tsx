/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import {
  useAddStaffMutation,
  useUpdateStaffInfoMutation,
} from "../../../../../redux/Features/Staff/staffApi";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Modal from "../../../../Reusable/Modal/Modal";
import Loader from "../../../../Reusable/Loader/Loader";
import TextInput from "../../../../Reusable/TextInput/TextInput";
import SelectDropdownWithSearch from "../../../../Reusable/SelectDropdownWithSearch/SelectDropdownWithSearch";
import PasswordInput from "../../../../Reusable/PasswordInput/PasswordInput";
import Button from "../../../../Reusable/Button/Button";

type TFormData = {
  name: string;
  email: string;
  phoneNumber: string;
  jobRole: string;
  gender: string;
  country: string;
  city: string;
  address: string;
  password: string;
};

type TAddOrUpdateStaffModalProps = {
  isStaffModalOpen: boolean;
  setIsStaffModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modalType: string;
  setModalType: React.Dispatch<React.SetStateAction<"add" | "edit">>;
  defaultValues?: any;
  isLoading: boolean;
};

const AddOrUpdateStaffModal: React.FC<TAddOrUpdateStaffModalProps> = ({
  isStaffModalOpen,
  setIsStaffModalOpen,
  modalType,
  setModalType,
  defaultValues,
  isLoading,
}) => {
  const [addStaff, { isLoading: isAddingStaff }] = useAddStaffMutation();
  const [updateStaffInfo, { isLoading: isUpdatingStaff }] =
    useUpdateStaffInfoMutation();
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<any>({
    gender: "",
    city: "",
    area: "",
  });
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TFormData>();

  const selectedGender = watch("gender");

  useEffect(() => {
    if (modalType === "edit" && defaultValues) {
      setValue("name", defaultValues?.userId?.name);
      setValue("email", defaultValues?.userId?.email);
      setValue("phoneNumber", defaultValues?.userId?.phoneNumber);
      setValue("jobRole", defaultValues?.jobRole);
      setValue("gender", defaultValues?.userId?.gender);
      setValue("country", defaultValues?.userId?.country);
      setValue("city", defaultValues?.userId?.city);
      setValue("address", defaultValues?.userId?.address);
    } else {
      reset();
    }
  }, [defaultValues, modalType, reset, setValue]);

  const handleSubmitStaff = async (data: TFormData) => {
    try {
      const payload = {
        ...data,
      };
      if (modalType === "add") {
        const res = await addStaff(payload).unwrap();
        if (res?.success) {
          reset();
          setFieldErrors({ gender: "", city: "", area: "" });
          setIsStaffModalOpen(false);
        }
      } else if (modalType === "edit" && defaultValues) {
        const res = await updateStaffInfo({
          id: defaultValues._id,
          data: payload,
        }).unwrap();
        if (res?.success) {
          reset();
          setFieldErrors({ gender: "", city: "", area: "" });
          setIsStaffModalOpen(false);
        }
      }
    } catch (err: any) {
      const errorMessage =
        err?.data?.message ||
        err?.error ||
        "Something went wrong. Please try again.";

      toast.error(errorMessage);
    }
  };

  return (
    <Modal
      isModalOpen={isStaffModalOpen}
      setIsModalOpen={setIsStaffModalOpen}
      heading={`${modalType === "add" ? "Add" : "Update"} Staff`}
    >
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-[2px] bg-white/30 z-50">
            <Loader size="lg" text="Please wait..." />
          </div>
        )}
        <form
          onSubmit={handleSubmit(handleSubmitStaff)}
          className="flex flex-col gap-6 font-Nunito mt-5"
        >
          <div className="flex flex-col gap-6">
            {/* Name */}
            <TextInput
              label="Name"
              placeholder="Enter full name"
              error={errors.name}
              {...register("name", {
                required: "Name is required",
              })}
            />

            {/* Email */}
            <TextInput
              label="Email"
              placeholder="Enter email"
              error={errors.email}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
            />

            {/* Phone */}
            <TextInput
              label="Phone Number"
              placeholder="Enter phone number"
              error={errors.phoneNumber}
              {...register("phoneNumber", {
                required: "Phone number is required",
              })}
            />

            {/* Job Role */}
            <TextInput
              label="Job Role"
              placeholder="Enter job role"
              error={errors.jobRole}
              {...register("jobRole", {
                required: "Job role is required",
              })}
            />

            {/* Gender */}
            <SelectDropdownWithSearch
              label="Gender"
              name="gender"
              value={selectedGender}
              options={["male", "female"]}
              onChange={(value) => setValue("gender", value)}
              isRequired={true}
              error={fieldErrors.gender}
            />

            {/* Country */}
            <TextInput
              label="Country"
              placeholder="Enter staff country"
              error={errors.country}
              {...register("country", {
                required: "Country is required",
              })}
            />

            {/* City */}
            <TextInput
              label="City"
              placeholder="Enter staff city"
              error={errors.city}
              {...register("city", {
                required: "City is required",
              })}
            />

            {/* Address */}
            <TextInput
              label="Address"
              placeholder="Enter staff address"
              error={errors.address}
              {...register("address")}
              isRequired={false}
            />

            {/* Password */}
            {modalType === "add" && (
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
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              label={"Cancel"}
              variant="secondary"
              onClick={() => {
                setIsStaffModalOpen(false);
                setModalType("add");
              }}
            />
            <Button
              type="submit"
              label={modalType === "add" ? "Add Staff" : "Update Staff"}
              variant="primary"
              isDisabled={isLoading || isAddingStaff || isUpdatingStaff}
              isLoading={isLoading || isAddingStaff || isUpdatingStaff}
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddOrUpdateStaffModal;
