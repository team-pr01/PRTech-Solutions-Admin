import { useParams } from "react-router-dom";
import EditJobForm from "../../../../components/Admin/EditJobPage/EditJobForm/EditJobForm";

const EditJob = () => {
  const {jobId} = useParams<{jobId: string}>();
  return (
    <div className="font-Nunito">
      <div className="bg-white border border-primary-10/30 rounded-2xl p-5 lg:p-7 flex flex-col gap-6 max-w-[1000px] mx-auto">
        {/* Heading */}
        <div className="flex flex-col items-center justify-center">
          <h1 className="font-bold text-xl text-neutral-10">
            Edit Job Details
          </h1>
          <p className="text-sm mt-[6px] text-neutral-10">
            Modify job information and requirements with ease.
          </p>
        </div>

        <EditJobForm jobId={jobId as string} />
      </div>
    </div>
  );
};

export default EditJob;
