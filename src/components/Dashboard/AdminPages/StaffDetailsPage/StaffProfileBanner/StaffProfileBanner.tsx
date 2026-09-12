import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const StaffProfileBanner = () => {
    const navigate = useNavigate();
  return (
    <div className="relative h-48 md:h-56 bg-gradient-to-r from-primary-10 via-primary-10/80 to-secondary-10">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full -ml-20 -mb-20"></div>

      {/* Back button */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/90 hover:text-white bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg transition-all hover:bg-white/20"
        >
          <FiArrowLeft size={18} />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>
    </div>
  );
};

export default StaffProfileBanner;
