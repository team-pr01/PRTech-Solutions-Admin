/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Table, {
  type TableHead,
} from "../../../../components/Reusable/Table/Table";
import { FiEye, FiSlash } from "react-icons/fi";
import SuspendUserModal from "../../../../components/Admin/SharedAdmin/SuspendUserModal/SuspendUserModal";
import {
  useGetAllGuardiansQuery,
  useSetGuardianOfTheMonthMutation,
} from "../../../../redux/Features/Guardian/guardianApi";
import { formatDate } from "../../../../utils/formatDate";
import { HiOutlineUserCircle } from "react-icons/hi";
import toast from "react-hot-toast";
import {
  useActiveUserMutation,
  useRestoreDeletedAccountMutation,
  useToggleProfileStatusMutation,
} from "../../../../redux/Features/User/userApi";
import { IMAGES } from "../../../../assets";
import { VscLock, VscUnlock } from "react-icons/vsc";
import UnlockRequestReasonModal from "../../../../components/Admin/Tutors/UnlockRequestReasonModal";
import { useNavigate } from "react-router-dom";
import RateUserModal from "../../../../components/Admin/SharedAdmin/RateUserModal/RateUserModal";
import { useNavigatePathForAdmin } from "../../../../utils/navigatePathForAdmin";
import { MdOutlineSettingsBackupRestore } from "react-icons/md";

export type TableAction<T> = {
  label: any;
  icon?: React.ReactNode;
  onClick: (row: T) => void;
};

const Guardians = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(30);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [areaOptions, setAreaOptions] = useState<string[]>([]);
  const [selectedGuardianId, setSelectedGuardianId] = useState<string | null>(
    null
  );
  const [selectedGuardianRating, setSelectedGuardianRating] = useState<
    string | null
  >(null);
  const [isSuspendUserModalOpen, setIsSuspendUserModalOpen] =
    useState<boolean>(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState<boolean>(false);
  const [unlockReason, setUnlockReason] = useState<string>("");
  const [isUnlockRequestReasonModalOpen, setIsUnlockRequestReasonModalOpen] =
    useState<boolean>(false);

  // Updated table heads
  const guardianTheads: TableHead[] = [
    { key: "_id", label: "Guardian ID" },
    { key: "name", label: "Name" },
    { key: "city", label: "City" },
    { key: "area", label: "Area" },
    { key: "registeredOn", label: "Registered On" },
    { key: "isVerified", label: "Verification Status" },
    { key: "rating", label: "Rating" },
    { key: "status", label: "Status" },
    { key: "profileStatus", label: "Profile Status" },
    { key: "guardianOfTheMonth", label: "Guardian of the Month" },
    { key: "hasAppliedForUnlock", label: "Applied to Unlock Profile" },
    { key: "isDeleted", label: "Account Deleted" },
  ];

  const { data, isLoading, isFetching } = useGetAllGuardiansQuery({
    city: selectedCity,
    area: selectedArea,
    keyword: searchQuery,
    page,
    limit,
  });
  const [activeUser] = useActiveUserMutation();
  const [toggleProfileStatus] = useToggleProfileStatusMutation();
  const [setGuardianOfTheMonth] = useSetGuardianOfTheMonthMutation();
  const [restoreDeletedAccount] = useRestoreDeletedAccountMutation();

  const handleActiveUser = async (id: string) => {
    try {
      await toast.promise(activeUser(id).unwrap(), {
        loading: "Loading...",
        success: "User re-activated successfully!",
        error: "Failed to reactivate user. Please try again.",
      });
    } catch (err) {
      console.error("Error deleting notice:", err);
    }
  };

  const handleSetGuardianOfTheMonth = async (id: string) => {
    try {
      await toast.promise(setGuardianOfTheMonth(id).unwrap(), {
        loading: "Please wait...",
        success: "Guardian set as Guardian of the Month successfully!",
        error: "Failed. Please try again.",
      });
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed. Please try again.");
    }
  };

  const handleToggleGuardianProfile = async (id: string) => {
    try {
      await toast.promise(toggleProfileStatus(id).unwrap(), {
        loading: "Loading...",
        success: "Status changed successfully!",
        error: "Failed to change status. Please try again.",
      });
    } catch (err: any) {
      toast.error(
        err?.data?.message || "Failed to change status. Please try again."
      );
    }
  };

  const handleRestoreDeletedAccount = async (id: string) => {
    try {
      await toast.promise(restoreDeletedAccount(id).unwrap(), {
        loading: "Please wait...",
        success: "Account restored successfully!",
        error: "Failed. Please try again.",
      });
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed. Please try again.");
    }
  };

  const navigatePath = useNavigatePathForAdmin();

  // Action Menu
  const actions: TableAction<any>[] = [
    {
      label: "View Profile",
      icon: <FiEye className="inline mr-2" />,
      onClick: (row) =>
        navigate(`/dashboard/${navigatePath}/guardian/${row._id}`),
    },
    {
      label: "Deactivate User",
      icon: <FiSlash className="inline mr-2" />,
      onClick: (row) => {
        setSelectedGuardianId(row?.userId);
        setIsSuspendUserModalOpen(true);
      },
    },
    {
      label: "Active User",
      icon: <HiOutlineUserCircle className="inline mr-2" />,
      onClick: (row) => {
        handleActiveUser(row.userId);
      },
    },
    {
      label: "Restore Account",
      icon: <MdOutlineSettingsBackupRestore className="inline mr-2" />,
      onClick: (row) => {
        handleRestoreDeletedAccount(row.userId);
      },
    },
    {
      label: "Lock Profile",
      icon: <VscLock className="inline mr-2" />,
      onClick: (row) => handleToggleGuardianProfile(row?.userId),
    },
    {
      label: "Unlock Profile",
      icon: <VscUnlock className="inline mr-2" />,
      onClick: (row) => handleToggleGuardianProfile(row?.userId),
    },
  ];

  // Formatted table data
  const tableData = data?.data?.guardians?.map((guardian: any) => ({
    _id: guardian.guardianId,
    userId: guardian.userId,
    name: (
      <div className="flex gap-2">
        <img
          src={guardian.imageUrl || IMAGES.dummyAvatar}
          alt={guardian?.name}
          className="size-7 rounded-full object-cover"
        />
        <div>
          <p className="capitalize">{guardian?.name}</p>
          <p>{guardian?.phoneNumber}</p>
          <p>{guardian?.email}</p>
        </div>
      </div>
    ),
    city: guardian?.city || "N/A",
    area: guardian?.area || "N/A",
    registeredOn: formatDate(guardian.createdAt),
    isVerified: (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          !guardian?.isVerified
            ? "bg-red-100 text-red-600"
            : "bg-green-100 text-green-600"
        }`}
      >
        {guardian?.isVerified ? "Verified" : "Not Verified"}
      </span>
    ),
    rating:
      guardian?.rating !== null ? (
        <div className="flex items-center gap-2">
          <span>{guardian?.rating ?? 0} / 5</span>
          <button
            onClick={() => {
              setSelectedGuardianId(guardian?.userId);
              setIsRatingModalOpen(true);
              setSelectedGuardianRating(guardian?.rating);
            }}
            className="text-primary-10 underline cursor-pointer"
          >
            Edit
          </button>
        </div>
      ) : (
        <button
          onClick={() => {
            setSelectedGuardianId(guardian?.userId);
            setIsRatingModalOpen(true);
          }}
          className="text-primary-10 underline cursor-pointer"
        >
          Rate
        </button>
      ),
    status: (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          guardian.isSuspended
            ? "bg-red-100 text-red-600"
            : "bg-green-100 text-green-600"
        }`}
      >
        {guardian.isSuspended ? "Deactivated" : "Active"}
      </span>
    ),
    profileStatus: (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
          guardian.profileStatus === "locked"
            ? "bg-red-100 text-red-600"
            : "bg-green-100 text-green-600"
        }`}
      >
        {guardian?.profileStatus}
      </span>
    ),
    guardianOfTheMonth: (
      <>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium capitalize mr-2 ${
            guardian?.guardianOfTheMonth
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-orange-500"
          }`}
        >
          {guardian?.guardianOfTheMonth ? "Yes" : "No"}
        </span>
        {!guardian.guardianOfTheMonth && (
          <button
            onClick={() => handleSetGuardianOfTheMonth(guardian._id)}
            className="text-xs font-Nunito text-neutral-10 underline cursor-pointer"
          >
            Set
          </button>
        )}
      </>
    ),
    hasAppliedForUnlock: (
      <button
        onClick={() => {
          setIsUnlockRequestReasonModalOpen(true);
          setUnlockReason(
            guardian?.unlockRequestReason || "No reason provided"
          );
        }}
        className={`${
          guardian?.hasAppliedForUnlock
            ? "text-blue-600 underline"
            : "text-neutral-500"
        } text-xs font-Nunito cursor-pointer`}
      >
        {guardian?.hasAppliedForUnlock ? "Yes" : "No"}
      </button>
    ),
    isDeleted: (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          guardian?.isDeleted
            ? "bg-red-100 text-red-600"
            : "bg-green-100 text-green-600"
        }`}
      >
        {guardian?.isDeleted ? "Yes" : "No"}
      </span>
    ),
  }));

  const handleSearch = (q: string) => {
    setSearchQuery(q);
  };

  return (
    <div>
      <Table<any>
        title="All Guardians/Students"
        description="Manage all the guardians and students registered on the platform."
        theads={guardianTheads}
        data={tableData || []}
        totalPages={data?.data?.meta?.totalPages || 1}
        currentPage={page}
        onPageChange={(p) => setPage(p)}
        isLoading={isLoading || isFetching}
        onSearch={handleSearch}
        actions={actions}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        areaOptions={areaOptions}
        selectedArea={selectedArea}
        setSelectedArea={setSelectedArea}
        setAreaOptions={setAreaOptions}
        limit={limit}
        setLimit={setLimit}
      />
      <SuspendUserModal
        selectedGuardianId={selectedGuardianId}
        isSuspendUserModalOpen={isSuspendUserModalOpen}
        setIsSuspendUserModalOpen={setIsSuspendUserModalOpen}
      />
      {isUnlockRequestReasonModalOpen && (
        <UnlockRequestReasonModal
          unlockReason={unlockReason}
          isUnlockRequestReasonModalOpen={isUnlockRequestReasonModalOpen}
          setIsUnlockRequestReasonModalOpen={setIsUnlockRequestReasonModalOpen}
        />
      )}

      {isRatingModalOpen && (
        <RateUserModal
          isRatingModalOpen={isRatingModalOpen}
          setIsRatingModalOpen={setIsRatingModalOpen}
          selectedUserId={selectedGuardianId}
          defaultValue={selectedGuardianRating as string}
          setSelectedUserRating={setSelectedGuardianRating}
        />
      )}
    </div>
  );
};

export default Guardians;
