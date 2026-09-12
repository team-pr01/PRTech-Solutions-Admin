import { useState } from "react";
import { FiExternalLink, FiImage, FiX } from "react-icons/fi";

const StaffPANCardInfo = ({
  panCardInfo,
}: {
  panCardInfo: {
    panCardFrontImage: string;
    panCardBackImage: string;
  };
}) => {
  const [activeImage, setActiveImage] = useState<
    "pan-front" | "pan-back" | null
  >(null);
  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-50/60 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-50/50 flex items-center gap-3">
          <div className="p-2 bg-secondary-10/10 rounded-lg">
            <FiImage className="text-secondary-10" size={18} />
          </div>
          <h2 className="font-semibold text-neutral-10">PAN Card Documents</h2>
        </div>
        <div className="p-6 space-y-4">
          {/* PAN Front */}
          <div>
            <p className="text-xs font-medium text-neutral-30 mb-2">
              PAN Card (Front)
            </p>
            {panCardInfo?.panCardFrontImage ? (
              <div
                className="relative group cursor-pointer rounded-lg overflow-hidden border border-neutral-50/60"
                onClick={() => setActiveImage("pan-front")}
              >
                <img
                  src={panCardInfo?.panCardFrontImage}
                  alt="PAN Front"
                  className="w-full object-cover"
                />
                <div className="absolute inset-0 bg-secondary-10/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <FiExternalLink className="text-white" size={20} />
                </div>
              </div>
            ) : (
              <div className="w-full h-32 bg-neutral-50/20 rounded-lg flex items-center justify-center border border-dashed border-neutral-50">
                <p className="text-xs text-neutral-30">Not uploaded</p>
              </div>
            )}
          </div>

          {/* PAN Back */}
          <div>
            <p className="text-xs font-medium text-neutral-30 mb-2">
              PAN Card (Back)
            </p>
            {panCardInfo?.panCardBackImage ? (
              <div
                className="relative group cursor-pointer rounded-lg overflow-hidden border border-neutral-50/60"
                onClick={() => setActiveImage("pan-back")}
              >
                <img
                  src={panCardInfo?.panCardBackImage}
                  alt="PAN Back"
                  className="w-full object-cover"
                />
                <div className="absolute inset-0 bg-secondary-10/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <FiExternalLink className="text-white" size={20} />
                </div>
              </div>
            ) : (
              <div className="w-full h-32 bg-neutral-50/20 rounded-lg flex items-center justify-center border border-dashed border-neutral-50">
                <p className="text-xs text-neutral-30">Not uploaded</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {activeImage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          onClick={() => setActiveImage(null)}
        >
          <div
            className="relative flex flex-col items-center justify-center"
            style={{ maxWidth: "90vw", maxHeight: "90vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveImage(null)}
              className="absolute -top-10 right-0 p-2 bg-white rounded-full text-neutral-10 hover:bg-neutral-50 transition"
              aria-label="Close"
            >
              <FiX size={20} />
            </button>

            {/* Image — constrained by BOTH width and height */}
            <img
              src={
                activeImage === "pan-front"
                  ? panCardInfo.panCardFrontImage
                  : panCardInfo.panCardBackImage
              }
              alt={activeImage === "pan-front" ? "PAN Front" : "PAN Back"}
              style={{
                maxWidth: "90vw",
                maxHeight: "80vh",
                width: "auto",
                height: "auto",
                objectFit: "contain",
                display: "block",
              }}
              className="rounded-2xl shadow-2xl"
            />

            {/* Caption */}
            <p className="text-center text-white mt-3 font-medium text-sm">
              {activeImage === "pan-front"
                ? "PAN Card - Front"
                : "PAN Card - Back"}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default StaffPANCardInfo;
