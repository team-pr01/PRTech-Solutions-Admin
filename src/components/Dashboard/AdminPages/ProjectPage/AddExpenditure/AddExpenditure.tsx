/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import Button from "../../../../Reusable/Button/Button";
import TextInput from "../../../../Reusable/TextInput/TextInput";
import toast from "react-hot-toast";
import { useAddExpenditureMutation } from "../../../../../redux/Features/Project/projectApi";
type TFormData = {
  description: string;
  totalAmount: number;
};

type TAddExpenditureProps = {
  projectId: string;
  onClose: () => void;
};
const AddExpenditure: React.FC<TAddExpenditureProps> = ({
  projectId,
  onClose,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TFormData>();

  const [addExpenditure] = useAddExpenditureMutation();

  const handleSubmitExpenditure = async (data: TFormData) => {
    try {
      const payload = {
        ...data,
      };
      const res = await addExpenditure({ projectId, data: payload }).unwrap();
      if (res?.success) {
        reset();
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
  return (
    <div className="mt-5">
      <form
        onSubmit={handleSubmit(handleSubmitExpenditure)}
        className="space-y-4"
      >
        {/* Name */}
        <TextInput
          label="Description"
          placeholder="Enter description"
          error={errors.description}
          {...register("description", {
            required: "Description is required",
          })}
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

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            onClick={onClose}
            variant="secondary"
            label="Cancel"
          />
          <Button type="submit" isDisabled={isSubmitting} label={"Submit"} />
        </div>
      </form>
    </div>
  );
};

export default AddExpenditure;
