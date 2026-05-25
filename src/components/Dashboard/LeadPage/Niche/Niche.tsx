import Loader from "../../../Reusable/Loader/Loader";
import Modal from "../../../Reusable/Modal/Modal";
import {
  useDeleteNicheMutation,
  useGetAllNichesQuery,
} from "../../../../redux/Features/Niche/nicheApi";
import { useState } from "react";
import Button from "../../../Reusable/Button/Button";
import toast from "react-hot-toast";
import { FiTrash2, FiEdit2 } from "react-icons/fi";
import AddOrEditNiche from "./AddOrEditNiche";

export type TNiche = {
  _id: string;
  name: string;
  subNiches: string[];
  createdAt: string;
};

type TNicheProps = {
  label?: string;
};

const Niche: React.FC<TNicheProps> = ({ label }) => {
  const { data, isLoading, refetch } = useGetAllNichesQuery({});
  const [isNicheModalOpen, setIsNicheModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<"add" | "edit">("add");
  const [isAddOrEditNicheModalOpen, setIsAddOrEditNicheModalOpen] = useState<boolean>(false);
  const [selectedNiche, setSelectedNiche] = useState<TNiche | null>(null);

  const [deleteNiche] = useDeleteNicheMutation();

  const handleDeleteNiche = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await toast.promise(deleteNiche(id).unwrap(), {
          loading: "Deleting...",
          success: "Niche deleted successfully!",
          error: "Failed to delete. Please try again.",
        });
        refetch();
      } catch (err) {
        console.error("Error deleting:", err);
      }
    }
  };

  const niches = data?.data || [];

  return (
    <div>
      <Button
        variant="secondary"
        label={label || "Manage Niches"}
        onClick={() => {
          setIsNicheModalOpen(true);
        }}
        className="px-3 py-2"
      />

      {isNicheModalOpen && (
        <Modal
          isModalOpen={isNicheModalOpen}
          setIsModalOpen={setIsNicheModalOpen}
          heading={label || "Niches"}
        >
          <div className="relative">
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-[2px] bg-white/30 z-50">
                <Loader size="lg" text="Please wait..." />
              </div>
            )}

            <div className="mt-8 mb-6 space-y-4">
              {niches.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No niches added yet</p>
                </div>
              ) : (
                niches.map((niche: TNiche) => (
                  <div
                    key={niche?._id}
                    className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-800 text-lg">
                        {niche?.name}
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={()=> {
                            setSelectedNiche(niche);
                            setModalType("edit");
                            setIsAddOrEditNicheModalOpen(true);
                          }}
                          className="text-blue-500 hover:text-blue-700 transition"
                          title="Edit Niche"
                        >
                          <FiEdit2 className="size-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteNiche(niche?._id, niche?.name)
                          }
                          className="text-red-500 hover:text-red-700 transition"
                          title="Delete Niche"
                        >
                          <FiTrash2 className="size-4" />
                        </button>
                      </div>
                    </div>

                    {niche?.subNiches && niche.subNiches.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {niche.subNiches.map((subNiche, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                          >
                            {subNiche}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}

              <Button
                label="Add New Niche"
                onClick={() => {
                  setSelectedNiche(null);
                  setModalType("add");
                  setIsAddOrEditNicheModalOpen(true);
                }}
                className="px-3 py-2 w-full flex items-center justify-center"
              />
            </div>

            {isAddOrEditNicheModalOpen && (
              <AddOrEditNiche
                setIsAddNicheFormOpen={setIsAddOrEditNicheModalOpen}
                defaultValues={modalType === "edit" && selectedNiche ? selectedNiche : null}
                modalType={modalType}
              />
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Niche;