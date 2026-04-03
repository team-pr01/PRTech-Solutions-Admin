import { useState } from "react";
import Button from "../../../../components/Reusable/Button/Button";
import ConfirmationLetterCard from "../../../../components/Dashboard/Tutor/ConfirmationLettersPage/ConfirmationLetterCard/ConfirmationLetterCard";
import Modal from "../../../../components/Reusable/Modal/Modal";
import ConfirmationLetterPreview from "../../../../components/Dashboard/Tutor/ConfirmationLettersPage/ConfirmationLetterPreview/ConfirmationLetterPreview";
import SendConfirmationLetterForm from "../../../../components/Admin/ConfirmationLetterManagementPage/SendConfirmationLetterForm/SendConfirmationLetterForm";
import { useGetAllConfirmationLettersQuery } from "../../../../redux/Features/ConfirmationLetter/confirmationLetterApi";
import type { TConfirmationLetter } from "../../../../types/confirmationLetter.types";
import Loader from "../../../../components/Reusable/Loader/Loader";
import NoData from "../../../../components/Reusable/NoData/NoData";
import LogoLoader from "../../../../components/Reusable/LogoLoader/LogoLoader";
import ErrorComponent from "../../../../components/Reusable/ErrorComponent/ErrorComponent";

const ConfirmationLetterManagement = () => {
  const [isConfirmationLetterModalOpen, setIsConfirmationLetterModalOpen] =
    useState<boolean>(false);
  const [selectedLetterId, setSelectedLetterId] = useState<string | null>(null);
  const [isLetterPreviewOpen, setIsLetterPreviewOpen] =
    useState<boolean>(false);
  const {
    data: allConfirmationLetters,
    isLoading,
    isError,
  } = useGetAllConfirmationLettersQuery({});

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center font-Nunito">
        <LogoLoader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center font-Nunito">
        <ErrorComponent />
      </div>
    );
  }
  return (
    <div className="font-Nunito flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">
          Total Confirmation Letters (
          {allConfirmationLetters?.data?.length || 0})
        </h3>
        <Button
          label="Send Confirmation Letter"
          onClick={() => {
            setIsConfirmationLetterModalOpen(true);
          }}
          className="px-3 lg:px-3 py-2 lg:py-2 border-none"
        />
      </div>

      {isLoading ? (
        <div className="py-10">
          <Loader size="lg" text="Please wait..." />
        </div>
      ) : allConfirmationLetters?.data &&
        allConfirmationLetters.data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allConfirmationLetters.data.map((letter: TConfirmationLetter) => (
            <ConfirmationLetterCard
              key={letter?._id}
              letter={letter}
              setSelectedLetterId={setSelectedLetterId}
              setIsLetterPreviewOpen={setIsLetterPreviewOpen}
            />
          ))}
        </div>
      ) : (
        <NoData />
      )}

      <Modal
        isModalOpen={isLetterPreviewOpen}
        setIsModalOpen={setIsLetterPreviewOpen}
        width="w-[95%] md:w-[80%] lg:w-[60%] xl:w-[40%] 2xl:w-[30%] max-h-[600px] overflow-y-auto"
      >
        <ConfirmationLetterPreview letterId={selectedLetterId as string} />
      </Modal>
      <Modal
        heading="Send Confirmation Letter"
        isModalOpen={isConfirmationLetterModalOpen}
        setIsModalOpen={setIsConfirmationLetterModalOpen}
        width="w-[95%] md:w-[80%] lg:w-[60%] xl:w-[40%] 2xl:w-[30%] max-h-[600px] overflow-y-auto"
      >
        <SendConfirmationLetterForm
          setIsConfirmationLetterModalOpen={setIsConfirmationLetterModalOpen}
        />
      </Modal>
    </div>
  );
};

export default ConfirmationLetterManagement;
