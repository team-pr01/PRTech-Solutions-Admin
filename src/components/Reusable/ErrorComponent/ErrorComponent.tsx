import React from "react";
import { FaExclamationTriangle, FaRedo, FaSignOutAlt } from "react-icons/fa";
import Button from "./../Button/Button";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { logout, setUser } from "../../../redux/Features/Auth/authSlice";
import { useNavigate } from "react-router-dom";

interface ErrorComponentProps {
  title?: string;
  description?: string;
  showRefresh?: boolean;
  showSignOut?: boolean;
  onRefresh?: () => void;
  onSignOut?: () => void;
  className?: string;
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({
  title = "Something Went Wrong",
  description = "We encountered an unexpected error. Please try refreshing the page. If the problem persists, try signing out and signing back in.",
  showRefresh = true,
  showSignOut = true,
  onRefresh,
  className = "",
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      window.location.reload();
    }
  };
  const handleLogout = async () => {
    dispatch(setUser({ user: null, token: null }));
    Cookies.remove("accessToken");
    Cookies.remove("role");
    dispatch(logout());
    localStorage.clear();
    navigate("/signin");
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-[400px] p-6 text-center ${className}`}
    >
      {/* Error Icon */}
      <div className="mb-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center">
            <FaExclamationTriangle className="text-red-500 text-4xl" />
          </div>
          <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-primary-10 flex items-center justify-center">
            <FaExclamationTriangle className="text-white text-xl" />
          </div>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-2xl lg:text-3xl font-bold text-neutral-10 mb-4">
        {title}
      </h2>

      {/* Description */}
      <p className="text-base lg:text-lg text-neutral-5 mb-8 max-w-2xl">
        {description}
      </p>

      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-3xl w-full">
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
          <div className="flex items-center justify-center mb-3">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
              <FaRedo className="text-blue-500 text-xl" />
            </div>
          </div>
          <h3 className="font-semibold text-neutral-10 mb-2">
            Step 1: Refresh
          </h3>
          <p className="text-sm text-neutral-5">
            Try refreshing the page. This often resolves temporary issues.
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
          <div className="flex items-center justify-center mb-3">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center">
              <FaSignOutAlt className="text-amber-500 text-xl" />
            </div>
          </div>
          <h3 className="font-semibold text-neutral-10 mb-2">
            Step 2: Sign Out & In
          </h3>
          <p className="text-sm text-neutral-5">
            If refreshing doesn't work, sign out and sign back in to reset your
            session.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        {showRefresh && (
          <Button
            onClick={handleRefresh}
            label={
              <div className="flex items-center gap-2">
                <FaRedo className="text-sm" />
                <span>Refresh Page</span>
              </div>
            }
            variant="outline"
            className="py-2 px-6 w-40 md:w-auto flex items-center justify-center"
          />
        )}

        {showSignOut && (
          <Button
            onClick={handleLogout}
            label={
              <div className="flex items-center gap-2">
                <FaSignOutAlt className="text-sm" />
                <span>Sign Out</span>
              </div>
            }
            variant="primary"
            className="py-2 px-6 w-40 md:w-auto flex items-center justify-center"
          />
        )}
      </div>

      {/* Troubleshooting Tips */}
      <div className="mt-10 pt-6 border-t border-gray-200 max-w-2xl">
        <h4 className="font-semibold text-neutral-10 mb-3">
          Still having issues?
        </h4>
        <ul className="text-sm text-neutral-5 space-y-2 text-left">
          <li className="flex items-start">
            <span className="text-primary-10 mr-2">•</span>
            Check your internet connection
          </li>
          <li className="flex items-start">
            <span className="text-primary-10 mr-2">•</span>
            Clear your browser cache and cookies
          </li>
          <li className="flex items-start">
            <span className="text-primary-10 mr-2">•</span>
            Try using a different browser
          </li>
          <li className="flex items-start">
            <span className="text-primary-10 mr-2">•</span>
            Contact support if the problem continues
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ErrorComponent;
