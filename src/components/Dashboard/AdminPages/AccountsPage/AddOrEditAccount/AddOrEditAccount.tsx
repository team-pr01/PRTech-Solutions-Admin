/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  useAddAccountMutation,
  useGetSingleAccountByIdQuery,
  useUpdateAccountMutation,
} from "../../../../../redux/Features/Accounts/accountsApi";
import SelectDropdown from "../../../../Reusable/SelectDropdown/SelectDropdown";
import TextInput from "../../../../Reusable/TextInput/TextInput";
import Button from "../../../../Reusable/Button/Button";

type AccountFormData = {
  type: "earning" | "expense";
  expenseType:
    | "salary"
    | "ui/ux"
    | "tools"
    | "graphics"
    | "deployment"
    | "other";
  description: string;
  currency: string;
  paidAmount: number;
  totalAmount: number;
  paidBy?: string;
  paymentMethod: string;
  date: string;
  note?: string;
};

type AddOrEditAccountProps = {
  accountId?: string;
  modalType: "add" | "edit";
  onClose: () => void;
  onSuccess?: () => void;
};

const AddOrEditAccount = ({
  accountId,
  modalType,
  onClose,
  onSuccess,
}: AddOrEditAccountProps) => {
  const { data: accountData, isLoading: isLoadingAccount } =
    useGetSingleAccountByIdQuery(accountId!, {
      skip: modalType !== "edit" || !accountId,
    });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<AccountFormData>();

  const [addAccount] = useAddAccountMutation();
  const [updateAccount] = useUpdateAccountMutation();

  const watchType = watch("type");

  // Options for dropdowns
  const typeOptions = ["earning", "expense"];

  const expenseTypeOptions = [
    "salary",
    "ui/ux",
    "tools",
    "graphics",
    "deployment",
    "other",
  ];

  const currencyOptions = ["USD", "BDT", "INR", "Other"];

  // Set default values when editing
  useEffect(() => {
    if (modalType === "edit" && accountData?.data) {
      const account = accountData.data;
      reset({
        type: account.type || "expense",
        expenseType: account.expenseType || "other",
        description: account.description || "",
        currency: account.currency || "USD",
        paidAmount: account.paidAmount || 0,
        totalAmount: account.totalAmount || 0,
        paidBy: account.paidBy || "",
        paymentMethod: account.paymentMethod || "",
        date: account.date
          ? new Date(account.date).toISOString().split("T")[0]
          : "",
        note: account.note || "",
      });
    } else {
      reset({
        type: "expense",
        expenseType: "other",
        description: "",
        currency: "USD",
        paidAmount: 0,
        totalAmount: 0,
        paidBy: "",
        paymentMethod: "",
        date: "",
        note: "",
      });
    }
  }, [modalType, accountData, reset]);

  const handleSubmitAccount = async (data: AccountFormData) => {
    try {
      const payload = {
        ...data,
        paidAmount: Number(data.paidAmount),
        totalAmount: Number(data.totalAmount),
        date: new Date(data.date).toISOString(),
        note: data.note || null,
      };

      if (modalType === "add") {
        const result = await addAccount(payload).unwrap();
        if (result.success) {
          toast.success("Transaction added successfully");
          reset();
          onSuccess?.();
          onClose();
        }
      } else {
        const result = await updateAccount({
          id: accountId!,
          data: payload,
        }).unwrap();
        if (result.success) {
          toast.success("Transaction updated successfully");
          onSuccess?.();
          onClose();
        }
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          `Failed to ${modalType === "add" ? "add" : "update"} transaction`,
      );
    }
  };

  if (modalType === "edit" && isLoadingAccount) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-10"></div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(handleSubmitAccount)}
      className="space-y-6 mt-5"
    >
      {/* Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectDropdown
          label="Transaction Type"
          options={typeOptions}
          error={errors.type}
          {...register("type", { required: "Transaction type is required" })}
        />

        {watchType === "expense" && (
          <SelectDropdown
            label="Expense Type"
            options={expenseTypeOptions}
            error={errors.expenseType}
            {...register("expenseType", {
              required:
                watchType === "expense" ? "Expense type is required" : false,
            })}
          />
        )}
      </div>

      {/* Description */}
      <TextInput
        label="Description"
        placeholder="Enter description"
        error={errors.description}
        {...register("description", { required: "Description is required" })}
      />

      {/* Currency and Amounts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

        <TextInput
          label="Paid Amount"
          type="number"
          placeholder="Enter paid amount"
          error={errors.paidAmount}
          {...register("paidAmount", {
            min: { value: 0, message: "Amount must be positive" },
            valueAsNumber: true,
          })}
        />
      </div>

      {/* Payment Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          label="Paid By"
          placeholder="Who made the payment?"
          error={errors.paidBy}
          {...register("paidBy")}
        />
        <TextInput
          label="Payment Method"
          placeholder="ex: Bank Transfer, bKash, PhonePe."
          error={errors.paymentMethod}
          {...register("paymentMethod")}
        />
      </div>

      {/* Date */}
      <TextInput
        label="Date"
        type="date"
        error={errors.date}
        {...register("date", { required: "Date is required" })}
      />

      {/* Note */}
      <TextInput
        label="Note"
        placeholder="ex:1st Installment"
        error={errors.note}
        {...register("note")}
        isRequired={false}
      />

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800">
          <span className="font-medium">Note:</span> Pending amount will be
          automatically calculated as Total - Paid.
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
          label={
            isSubmitting
              ? modalType === "add"
                ? "Adding..."
                : "Updating..."
              : modalType === "add"
                ? "Add Transaction"
                : "Update Transaction"
          }
        />
      </div>
    </form>
  );
};

export default AddOrEditAccount;
