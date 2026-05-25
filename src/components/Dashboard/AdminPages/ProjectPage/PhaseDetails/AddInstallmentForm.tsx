/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import SelectDropdown from "../../../../Reusable/SelectDropdown/SelectDropdown";
import Textarea from "../../../../Reusable/TextArea/TextArea";
import TextInput from "../../../../Reusable/TextInput/TextInput";
import { useAddInstallmentMutation } from "../../../../../redux/Features/Project/projectApi";
import Button from "../../../../Reusable/Button/Button";

type TInstallmentFormdata = {
  amount: number;
  date: string;
  paymentMethod?:
    | "Cash"
    | "Bank Transfer"
    | "Credit Card"
    | "PayPal"
    | "bKash"
    | "Nagad"
    | "PhonePe"
    | "Google Pay"
    | "Payoneer"
    | "Other";
  receiver?: string;
  note?: string;
};

const AddInstallmentForm = ({
  projectId,
  phaseId,
  setIsAddInstallmentDrawerOpen,
}: {
  projectId: string;
  phaseId: string;
  setIsAddInstallmentDrawerOpen: any;
}) => {
  const [addInstallment, { isLoading }] = useAddInstallmentMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TInstallmentFormdata>();

  const paymentMethodOptions = [
    "Bank Transfer",
    "Cash",
    "bKash",
    "Nagad",
    "PhonePe",
    "Google Pay",
    "PayPal",
    "Payoneer",
    "Credit Card",
    "Other",
  ];

  const handleAddInstallment = async (data: TInstallmentFormdata) => {
    try {
      const payload = {
        amount: data.amount,
        date: data.date,
        paymentMethod: data.paymentMethod,
        receiver: data.receiver,
        note: data.note,
      };

      const response = await addInstallment({
        projectId,
        phaseId,
        data: payload,
      }).unwrap();

      if (response.success) {
        setIsAddInstallmentDrawerOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleAddInstallment)} className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <TextInput
          label="Amount"
          type="number"
          placeholder="Enter amount"
          error={errors.amount}
          {...register(`amount`, {
            required: "Amount is required",
            min: { value: 0, message: "Amount must be positive" },
            valueAsNumber: true,
          })}
        />

        <TextInput
          label="Date"
          type="date"
          error={errors.date}
          {...register(`date`, {
            required: "Date is required",
          })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <SelectDropdown
          label="Payment Method"
          options={paymentMethodOptions}
          {...register(`paymentMethod`)}
        />

        <TextInput
          label="Receiver"
          placeholder="Receiver name"
          {...register(`receiver`)}
        />
      </div>

      <Textarea
        label="Note"
        placeholder="Additional note"
        {...register(`note`)}
        isRequired={false}
      />

      {/* Form Actions */}
      <div className="flex justify-end gap-3 mt-6">
        <Button
          type="button"
          onClick={() => setIsAddInstallmentDrawerOpen(false)}
          variant="secondary"
          label="Cancel"
        />
        <Button
          type="submit"
          isDisabled={isLoading}
          label={isLoading ? "Adding..." : "Add Installment"}
        />
      </div>
    </form>
  );
};

export default AddInstallmentForm;
