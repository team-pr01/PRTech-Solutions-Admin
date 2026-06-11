/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import TextInput from "../../../Reusable/TextInput/TextInput";
import Button from "../../../Reusable/Button/Button";
import toast from "react-hot-toast";
import { useAddLeadMutation } from "../../../../redux/Features/Lead/leadApi";
import { useState } from "react";
import SelectDropdown from "../../../Reusable/SelectDropdown/SelectDropdown";
import { useGetAllNichesQuery } from "../../../../redux/Features/Niche/nicheApi";

type TFormData = {
  quickLink: string;
  issueFound: string;
  niche: string;
  subNiche: string;
};
const AddQuickLead = ({ onClose }: { onClose: () => void }) => {
  const [selectedNiche, setSelectedNiche] = useState<any>(null);
  const [subNicheOptions, setSubNicheOptions] = useState<string[]>([]);

  const { data: niches } = useGetAllNichesQuery({});
  const [addLead, { isLoading: isSubmitting }] = useAddLeadMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<TFormData>();

  const handleSubmitLead = async (data: TFormData) => {
    try {
      const payload = {
        ...data,
        niche: selectedNiche?.name,
        subNiche: data.subNiche,
      };

      const result = await addLead(payload).unwrap();
      if (result.success) {
        toast.success("Quick Lead added successfully");
        reset();
        onClose();
      }
    } catch (error: any) {
      toast.error(error?.data?.message || `Failed to add lead`);
    }
  };

  const handleNicheChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedNicheName = e.target.value;
    const foundNiche = niches?.data?.find(
      (niche: any) => niche.name === selectedNicheName,
    );

    setSelectedNiche(foundNiche);

    // Set sub-niche options
    if (foundNiche && foundNiche.subNiches) {
      setSubNicheOptions(foundNiche.subNiches);
    } else {
      setSubNicheOptions([]);
    }

    // Clear sub-niche value when niche changes
    setValue("subNiche", "");
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitLead)} className="space-y-6 mt-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <TextInput
          label="Quick Link"
          placeholder="Enter quick link"
          error={errors.quickLink}
          {...register("quickLink", {
            required: "Quick link is required",
          })}
        />

        <TextInput
          label="Issue Found"
          placeholder="Describe the issue or requirement"
          error={errors.issueFound}
          {...register("issueFound")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Niche Dropdown */}
        <SelectDropdown
          label="Niche"
          options={niches?.data?.map((niche: any) => niche.name) || []}
          error={errors.niche}
          {...register("niche", {
            required: "Niche is required",
            onChange: handleNicheChange,
          })}
        />

        <SelectDropdown
          label="Sub Niche"
          options={subNicheOptions}
          error={errors.subNiche}
          {...register("subNiche")}
          isRequired={false}
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          onClick={onClose}
          variant="secondary"
          label="Cancel"
        />
        <Button
          type="submit"
          isDisabled={isSubmitting}
          label={isSubmitting ? "Please wait..." : "Add Quick Lead"}
        />
      </div>
    </form>
  );
};

export default AddQuickLead;
