import { RxCross1 } from "react-icons/rx";
import { ICONS } from "../../../assets";
import Button from "../Button/Button";

const DeleteJobConfirmationModal = ({
  isConfirmDeleteModalOpen,
  setIsConfirmDeleteModalOpen,
}: {
  isConfirmDeleteModalOpen: boolean;
  setIsConfirmDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const handleSubmitDeleteRequest = () => {
    console.log("data");
  };
  return (
    <div
      className={`${
        isConfirmDeleteModalOpen ? "visible" : "invisible"
      } w-full h-screen fixed top-0 left-0 z-[200000000] bg-[#0000002a] flex items-center justify-center transition-all duration-300 font-Nunito`}
    >
      <div
        className={`${
          isConfirmDeleteModalOpen
            ? "scale-100 opacity-100"
            : "scale-0 opacity-0"
        } w-[90%] sm:w-[60%] lg:w-[50%] xl:w-[40%] 2xl:w-[25%] bg-gradient-to-r from-slate-50 to-sky-50 rounded-lg p-6 transition-all duration-300 relative`}
      >
        <RxCross1
          className="text-lg cursor-pointer absolute top-5 right-4"
          onClick={() => setIsConfirmDeleteModalOpen(false)}
        />

        <div className="w-full flex flex-col items-center gap-6">
          <img src={ICONS.warning} alt="warning icon" className="size-28" />

          <div className="text-center text-neutral-900">
            <h1 className="text-xl font-semibold">Delete Job</h1>
            <p className="text-sm mt-2">
              Are you sure you want to delete this job?
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Button
              type="button"
              label="Yes, Delete"
              variant="primary"
              className="py-2 lg:py-2"
              onClick={handleSubmitDeleteRequest}
            />
            <Button
              type="button"
              label="Cancel"
              variant="tertiary"
              className="py-2 lg:py-2"
              onClick={() => setIsConfirmDeleteModalOpen(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteJobConfirmationModal;
