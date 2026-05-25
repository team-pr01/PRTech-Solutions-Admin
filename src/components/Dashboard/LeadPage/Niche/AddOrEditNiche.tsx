/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-hot-toast";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import Button from "../../../Reusable/Button/Button";
import TextInput from "../../../Reusable/TextInput/TextInput";
import {
  useAddNicheMutation,
  useUpdateNicheMutation,
} from "../../../../redux/Features/Niche/nicheApi";
import { useEffect } from "react";

type TNicheFormData = {
  name: string;
  subNiches: { value: string }[];
};

type TAddOrEditNicheProps = {
  setIsAddNicheFormOpen: (value: boolean) => void;
  defaultValues?: any;
  modalType: "add" | "edit";
};

const AddOrEditNiche = ({
  setIsAddNicheFormOpen,
  defaultValues,
  modalType,
}: TAddOrEditNicheProps) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<TNicheFormData>({
    defaultValues: {
      name: "",
      subNiches: [{ value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subNiches",
  });

  const [addNiche] = useAddNicheMutation();
  const [updateNiche] = useUpdateNicheMutation();

  useEffect(() => {
    if (defaultValues && modalType === "edit") {
      setValue("name", defaultValues.name);

      for (let i = fields.length - 1; i >= 0; i--) {
        remove(i);
      }

      if (defaultValues.subNiches && defaultValues.subNiches.length > 0) {
        defaultValues.subNiches.forEach((sub: string) => {
          append({ value: sub });
        });
      } else {
        append({ value: "" });
      }
    }
  }, [defaultValues, modalType]);

  const onSubmit = async (data: TNicheFormData) => {
    try {
      const subNichesArray = data.subNiches
        .map((item) => item.value.trim())
        .filter((item) => item !== "");

      const payload = {
        name: data.name.trim(),
        subNiches: subNichesArray,
      };

      if (modalType === "edit") {
        await toast.promise(
          updateNiche({ id: defaultValues._id, data: payload }).unwrap(),
          {
            loading: "Updating niche...",
            success: "Niche updated successfully!",
            error: "Failed to update niche. Please try again.",
          },
        );
      } else {
        await toast.promise(addNiche(payload).unwrap(), {
          loading: "Adding niche...",
          success: "Niche added successfully!",
          error: "Failed to add niche. Please try again.",
        });
      }

      reset();
      setIsAddNicheFormOpen(false);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <TextInput
          label="Niche Name"
          placeholder="Enter niche name (e.g., E-commerce)"
          error={errors.name}
          {...register("name", {
            required: "Niche name is required",
            minLength: {
              value: 2,
              message: "Niche name must be at least 2 characters",
            },
          })}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Sub Niches
          </label>
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <TextInput
                placeholder={`Sub Niche ${index + 1}`}
                {...register(`subNiches.${index}.value`)}
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-500 hover:text-red-700 p-1"
                title="Remove sub niche"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => append({ value: "" })}
            className="flex items-center gap-1 text-sm text-primary-10 hover:text-primary-20 mt-2"
          >
            <FiPlus size={14} /> Add Sub Niche
          </button>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="secondary"
            label="Cancel"
            onClick={() => setIsAddNicheFormOpen(false)}
          />
          <Button
            type="submit"
            label={
              isSubmitting
                ? modalType === "edit"
                  ? "Updating..."
                  : "Adding..."
                : modalType === "edit"
                  ? "Update Niche"
                  : "Add Niche"
            }
            isDisabled={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
};

export default AddOrEditNiche;
