/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IMAGES } from "../../../../assets";
import { BiHelpCircle, BiLogOut } from "react-icons/bi";
import { CiSettings } from "react-icons/ci";
import { LuUser } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout, setUser } from "../../../../redux/Features/Auth/authSlice";
import Cookies from "js-cookie";

const UserProfileDropdown = ({ user }: { user: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dropdownVariants: any = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      rotateY: -20,
      transformOrigin: "top right",
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transformOrigin: "top right",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        staggerChildren: 0.07,
      },
    },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -15 },
    visible: { opacity: 1, x: 0 },
  };

  const MotionLink = motion(Link);

  const path =
    user?.role === "tutor" ? "/dashboard/tutor" : "/dashboard/guardian";

  const handleLogout = async () => {
    dispatch(setUser({ user: null, token: null }));
    Cookies.remove("accessToken");
    Cookies.remove("role");
    dispatch(logout());
    localStorage.clear();
    navigate("/signin");
  };
  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Picture Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="size-9 rounded-full bg-primary-10 flex items-center justify-center p-[2px] shadow-md cursor-pointer focus:outline-none"
      >
        <div className="p-[2px] bg-white rounded-full w-full h-full">
          <img
            src={IMAGES.dummyAvatar}
            className="w-full h-full object-cover rounded-full"
            alt={user?.name}
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      <div style={{ perspective: "1000px" }}>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={dropdownVariants}
              className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl z-20"
            >
              {/* User Info Header */}
              <motion.div
                variants={itemVariants}
                className="px-4 py-3 border-b border-neutral-20/10 flex items-center gap-3"
              >
                <img
                  src={user?.profilePicture || IMAGES.dummyAvatar}
                  className="size-10 object-cover rounded-full"
                  alt={user?.name}
                />
                <div>
                  <p className="font-semibold text-neutral-90">{user?.name}</p>
                  <p className="text-sm text-neutral-45 capitalize">
                    {user?.role} Id: {user?.roleBasedId}
                  </p>
                </div>
              </motion.div>

              {/* Menu Links */}
              <motion.ul className="py-2">
                <MotionLink
                  to={`${path}/my-profile`}
                  onClick={() => setIsOpen(false)}
                  variants={itemVariants}
                  className="px-4 py-2 flex items-center gap-3 cursor-pointer hover:bg-neutral-45/10 transition duration-500"
                >
                  <LuUser size={18} /> View Profile
                </MotionLink>
                <MotionLink
                  to={`${path}/important-guidelines`}
                  onClick={() => setIsOpen(false)}
                  variants={itemVariants}
                  className="px-4 py-2 flex items-center gap-3 cursor-pointer hover:bg-neutral-45/10 transition duration-500"
                >
                  <BiHelpCircle size={18} /> Important Guidelines
                </MotionLink>
                <MotionLink
                  to={`${path}/settings`}
                  onClick={() => setIsOpen(false)}
                  variants={itemVariants}
                  className="px-4 py-2 flex items-center gap-3 cursor-pointer hover:bg-neutral-45/10 transition duration-500"
                >
                  <CiSettings size={18} /> Account Settings
                </MotionLink>
              </motion.ul>

              {/* Divider */}
              <motion.div
                variants={itemVariants}
                className="h-px bg-neutral-20/20"
              ></motion.div>

              <div>
                <motion.ul className="py-2">
                  <motion.li
                    variants={itemVariants}
                    onClick={handleLogout}
                    className="px-4 py-2 flex items-center gap-3 cursor-pointer hover:bg-red-50/70 text-red-500"
                  >
                    <BiLogOut size={18} /> Log Out
                  </motion.li>
                </motion.ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UserProfileDropdown;
