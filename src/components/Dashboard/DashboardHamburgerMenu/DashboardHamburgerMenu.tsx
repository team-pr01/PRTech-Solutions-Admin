import { Link, useNavigate } from "react-router-dom";
import { ICONS } from "../../../assets";
import { useEffect, useState } from "react";
import { TbLogout2 } from "react-icons/tb";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import {
  logout,
  setUser,
} from "../../../redux/Features/Auth/authSlice";
import RoleBasedNavlinks from "../Sidebar/RoleBasedNavlinks/RoleBasedNavlinks";

const DashboardHamburgerMenu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);

  const toggleHamburgerMenu = () => {
    setIsHamburgerOpen(!isHamburgerOpen);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const closestDropdown = target.closest(".hamburgerMenu");
      if (isHamburgerOpen && closestDropdown === null) {
        setIsHamburgerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isHamburgerOpen]);

  const handleLogout = async () => {
    dispatch(setUser({ user: null, token: null }));
    Cookies.remove("accessToken");
    Cookies.remove("role");
    dispatch(logout());
    localStorage.clear();
    navigate("/signin");
  };

  return (
    <div className="relative hamburgerMenu flex xl:hidden">
      <button
        onClick={toggleHamburgerMenu}
        className="bg-white w-10 h-9 border border-primary-10 cursor-pointer rounded-lg flex items-center justify-center"
      >
        <img src={ICONS.menu} alt="menu-icon" />
      </button>

      {/* Background Overlay */}
      <div
        onClick={toggleHamburgerMenu}
        className={`fixed inset-0 bg-black z-50 transition-opacity duration-300 ${
          isHamburgerOpen ? "opacity-50" : "opacity-0 pointer-events-none"
        }`}
      ></div>

      {/* Side Menu */}
      <div
        className={`fixed inset-y-0 left-0 z-9999 bg-primary-10 py-8 p-6 w-[250px] overflow-y-auto transition-all duration-300 transform flex flex-col gap-4 items-start justify-between ${
          isHamburgerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Link to="/">
          <img src={ICONS.logoWhite} alt="Logo" className="mb-5 mx-auto" />
        </Link>

        <hr className="border border-neutral-50/30 w-full" />

        <RoleBasedNavlinks setIsHamburgerOpen={setIsHamburgerOpen} />

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

export default DashboardHamburgerMenu;
