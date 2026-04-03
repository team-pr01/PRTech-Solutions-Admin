import { Link, useNavigate } from "react-router-dom";
import { TbLogout2 } from "react-icons/tb";
import { useDispatch } from "react-redux";
import { logout, setUser } from "../../../redux/Features/Auth/authSlice";
import { ICONS } from "../../../assets";
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
      <div className="w-[230px] 2xl:w-[270px] h-full bg-primary-10 p-5 font-Nunito flex flex-col gap-5 justify-between">
        <Link to="/">
          <img src={ICONS.logoWhite} alt="Logo" className="mb-5" />
        </Link>
        <hr className="border border-neutral-50/30" />
        <div className="flex flex-col gap-4 h-full xl:h-[380px] 2xl:h-[600px] overflow-y-auto custom-scrollbar-sidebar">
          <RoleBasedNavlinks />
        </div>

        <button
          onClick={handleLogout}
          className={`text-lg flex items-center gap-2 rounded-lg p-2 transform transition-transform duration-500 hover:-translate-y-1 text-white font-semibold cursor-pointer`}
        >
          <TbLogout2 className="text-xl" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
