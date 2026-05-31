/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { useAddGiftMutation } from "../../../../../redux/Features/Client/clientApi";
import Button from "../../../../Reusable/Button/Button";
import SelectDropdown from "../../../../Reusable/SelectDropdown/SelectDropdown";
import TextInput from "../../../../Reusable/TextInput/TextInput";
import toast from "react-hot-toast";
type TFormData = {
  title: string;
  sentDate: Date;
  currency: string;
  totalAmount: number;
  paymentMethod: string;
};

type TAdOrEditGiftProps = {
  giftId?: string;
  clientId: string;
  modalType: "add" | "edit";
  onClose: () => void;
};
const AdOrEditGift: React.FC<TAdOrEditGiftProps> = ({
  //   giftId,
  clientId,
  modalType,
  onClose,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TFormData>();

  const [addGift] = useAddGiftMutation();
  const currencyOptions = ["BDT", "INR", "USD", "Other"];

  const handleSubmitGift = async (data: TFormData) => {
    try {
      const payload = {
        ...data,
      };
      if (modalType === "add") {
        const res = await addGift({ clientId, data: payload }).unwrap();
        if (res?.success) {
          reset();
          onClose();
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
    <div className="mt-5">
      <form onSubmit={handleSubmit(handleSubmitGift)} className="space-y-4">
        {/* Name */}
        <TextInput
          label="Title"
          placeholder="Enter title"
          error={errors.title}
          {...register("title", {
            required: "Title is required",
          })}
        />

        <div className="grid grid-cols-2 gap-4">
          <TextInput
            label="Payment Method"
            placeholder="ex: Bank Transfer, bKash, PhonePe."
            error={errors.paymentMethod}
            {...register("paymentMethod")}
          />

          <TextInput
            label="Sent date"
            type="date"
            placeholder=""
            error={errors.sentDate}
            {...register("sentDate")}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <SelectDropdown
            label="Currency"
            options={currencyOptions}
            error={errors.currency}
            {...register("currency", { required: "Currency is required" })}
          />

          <TextInput
            label="Total Amount"
            type="number"
            placeholder="Enter total amount"
            error={errors.totalAmount}
            {...register("totalAmount", {
              required: "Total amount is required",
              min: { value: 0, message: "Amount must be positive" },
              valueAsNumber: true,
            })}
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            onClick={onClose}
            variant="secondary"
            label="Cancel"
          />
          <Button
            type="submit"
            isDisabled={isSubmitting}
            label={
              isSubmitting
                ? modalType === "add"
                  ? "Adding..."
                  : "Updating..."
                : modalType === "add"
                  ? "Add Gift"
                  : "Update Gift"
            }
          />
        </div>
      </form>
    </div>
  );
};

export default AdOrEditGift;
