/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import Button from "../../../../Reusable/Button/Button";
import TextInput from "../../../../Reusable/TextInput/TextInput";
import SelectDropdown from "../../../../Reusable/SelectDropdown/SelectDropdown";
import toast from "react-hot-toast";
import { useAddPhaseInExpenditureMutation } from "../../../../../redux/Features/Project/projectApi";

type TFormData = {
  title: string;
  paidAmount: number;
  date: string;
  paymentMethod: string;
  currency: string;
};

type TAddPhaseInExpenditureProps = {
  projectId: string;
  expenditureId: string;
  onClose: () => void;
  onSuccess?: () => void;
};

const AddPhaseInExpenditure: React.FC<TAddPhaseInExpenditureProps> = ({
  projectId,
  expenditureId,
  onClose,
  onSuccess,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TFormData>({
    defaultValues: {
      title: "",
      paidAmount: 0,
      date: "",
      paymentMethod: "Bank Transfer",
      currency: "BDT",
    },
  });

  const [addPhaseInExpenditure] = useAddPhaseInExpenditureMutation();

  // Options for dropdowns
  const currencyOptions = ["BDT", "INR", "USD", "Other"];
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

  const handleSubmitPhase = async (data: TFormData) => {
    try {
      const payload = {
        title: data.title,
        paidAmount: Number(data.paidAmount),
        date: new Date(data.date).toISOString(),
        paymentMethod: data.paymentMethod,
        currency: data.currency,
      };

      const res = await addPhaseInExpenditure({
        projectId,
        expenditureId,
        data: payload,
      }).unwrap();

      if (res?.success) {
        toast.success("Phase added successfully");
        reset();
        onSuccess?.();
        onClose();
      }
    } catch (err: any) {
      const errorMessage =
        err?.data?.message ||
        err?.error ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
    }
  };

  // Get today's date in YYYY-MM-DD format for min date
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <div className="mt-5">
      <form onSubmit={handleSubmit(handleSubmitPhase)} className="space-y-4">
        {/* Title */}
        <TextInput
          label="Phase Title"
          placeholder="Enter phase title (e.g., Office Furniture, Software License)"
          error={errors.title}
          {...register("title", {
            required: "Title is required",
            minLength: {
              value: 3,
              message: "Title must be at least 3 characters",
            },
          })}
        />

        {/* Paid Amount */}
        <TextInput
          label="Paid Amount"
          type="number"
          placeholder="Enter paid amount"
          error={errors.paidAmount}
          {...register("paidAmount", {
            required: "Paid amount is required",
            min: { value: 0.01, message: "Amount must be greater than 0" },
            valueAsNumber: true,
          })}
        />

        {/* Date */}
        <TextInput
          label="Date"
          type="date"
          max={getMinDate()}
          error={errors.date}
          {...register("date", {
            required: "Date is required",
          })}
        />

        {/* Payment Method & Currency */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectDropdown
            label="Payment Method"
            options={paymentMethodOptions}
            error={errors.paymentMethod}
            {...register("paymentMethod", {
              required: "Payment method is required",
            })}
          />

          <SelectDropdown
            label="Currency"
            options={currencyOptions}
            error={errors.currency}
            {...register("currency", {
              required: "Currency is required",
            })}
          />
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Note:</span> Adding a phase will
            update the expenditure totals and create an account entry for this
            expense.
          </p>
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
            label={isSubmitting ? "Adding..." : "Add Phase"}
          />
        </div>
      </form>
    </div>
  );
};

export default AddPhaseInExpenditure;
