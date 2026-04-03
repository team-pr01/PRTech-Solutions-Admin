import { Link, useNavigate } from "react-router-dom";
import { TbLogout2 } from "react-icons/tb";
import { useDispatch } from "react-redux";
import { logout, setUser } from "../../../redux/Features/Auth/authSlice";
import { IMAGES } from "../../../assets";
import Cookies from "js-cookie";
import RoleBasedNavlinks from "./RoleBasedNavlinks/RoleBasedNavlinks";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    dispatch(setUser({ user: null, token: null }));
    Cookies.remove("accessToken");
    Cookies.remove("role");
    dispatch(logout());
    localStorage.clear();
    navigate("/signin");
  };

  return (
    <div className="top-0 left-0 hidden xl:block">
      <div className="w-[230px] 2xl:w-[270px] h-full bg-white font-Nunito flex flex-col gap-5">
        <Link
          to="/dashboard/admin/home"
          className="border-b border-r border-neutral-50/40 py-5"
        >
          <img src={IMAGES.logo} alt="Logo" className="w-39 mx-auto" />
        </Link>
        <div className="w-full h-full flex flex-col justify-between p-5">
          <div className="flex flex-col gap-4 h-full xl:h-[380px] 2xl:h-[600px] overflow-y-auto custom-scrollbar-sidebar">
            <RoleBasedNavlinks />
          </div>

          <button
            onClick={handleLogout}
            className={`text-lg flex items-center justify-center gap-2 rounded-lg p-2 transform transition-transform duration-500 hover:-translate-y-1 bg-primary-10 text-white font-semibold cursor-pointer w-full`}
          >
            <TbLogout2 className="text-xl" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
