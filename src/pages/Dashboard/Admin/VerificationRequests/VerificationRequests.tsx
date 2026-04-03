/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import type { TableHead } from "../../../../components/Reusable/Table/Table";
import type { TableAction } from "../Guardians/Guardians";
import {
  FiCheckCircle,
  FiFileText,
  FiSend,
  FiMapPin,
  FiShield,
  FiUser,
} from "react-icons/fi";
import toast from "react-hot-toast";
import Table from "../../../../components/Reusable/Table/Table";
import { formatDate } from "../../../../utils/formatDate";
import {
  useAcceptRequestMutation,
  useGetAllVerificationRequestsQuery,
  useMarkAsAddressVerificationLetterSentMutation,
  useMarkAsInvoiceDueMutation,
  useMarkAsVerifiedMutation,
  useReviewRequestMutation,
} from "../../../../redux/Features/VerificationRequest/verificationRequestApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useNavigatePathForAdmin } from "../../../../utils/navigatePathForAdmin";

const VerificationRequests = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>(status || "");
  const { data, isLoading, isFetching } = useGetAllVerificationRequestsQuery({
    page,
    limit,
    status: statusFilter,
    keyword: searchQuery,
  });
  const navigatePath = useNavigatePathForAdmin();
  const [acceptRequest] = useAcceptRequestMutation();
  const [reviewRequest] = useReviewRequestMutation();
  const [markAsInvoiceDue] = useMarkAsInvoiceDueMutation();
  const [markAsAddressVerificationLetterSent] =
    useMarkAsAddressVerificationLetterSentMutation();
  const [markAsVerified] = useMarkAsVerifiedMutation();

  // Table headers
  const verificationRequestsTheads: TableHead[] = [
    { key: "userInfo", label: "User Info" },
    { key: "createdAt", label: "Requested Date" },
    { key: "addressVerificationCode", label: "Submitted Verification Code" },
    { key: "generatedAddressVerificationCode", label: "Admin Generated Code" },
    { key: "completedAt", label: "Verification Completed At" },
    { key: "status", label: "Status" },
  ];

  // Actions

  const actions: TableAction<any>[] = [
    {
      label: "View Profile",
      icon: <FiUser className="inline text-gray-600" />,
      onClick: (row) => {
        if (row?.userRole === "tutor") {
          navigate(`/dashboard/${navigatePath}/tutor/${row?.tutorId}`);
        } else {
          navigate(
            `/dashboard/${navigatePath}/guardian/${row.guardianUniqueId}`,
          );
        }
      },
    },
    {
      label: "Accept Request",
      icon: <FiCheckCircle className="inline text-green-600" />,
      onClick: (row) => {
        handleAcceptRequest(row);
      },
    },
    {
      label: "Review Documents",
      icon: <FiFileText className="inline text-blue-600" />,
      onClick: (row) => {
        handleReviewRequest(row);
      },
    },
    {
      label: "Invoice Sent",
      icon: <FiSend className="inline text-indigo-600" />,
      onClick: (row) => {
        handleMarkAsInvoiceDue(row);
      },
    },
    {
      label: "Address Verification",
      icon: <FiMapPin className="inline text-orange-600" />,
      onClick: (row) => {
        handleMarkAsAddressVerificationLetterSent(row);
      },
    },
    {
      label: "Verified",
      icon: <FiShield className="inline text-emerald-600" />,
      onClick: (row) => {
        handleMarkAsVerified(row);
      },
    },
  ];

  const statusStyles: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-600",
    accepted: "bg-blue-100 text-blue-600",
    reviewing: "bg-yellow-100 text-yellow-700",
    invoiceDue: "bg-purple-100 text-purple-600",
    addressVerification: "bg-orange-100 text-orange-600",
    verified: "bg-green-100 text-green-600",
  };

  const getVerificationStatusLabel = (label: string) => {
    switch (label) {
      case "pending":
        return "Pending";
      case "accepted":
        return "Accepted";
      case "reviewing":
        return "Reviewing";
      case "invoiceDue":
        return "Invoice Due";
      case "addressVerification":
        return "Address Verification";
      case "verified":
        return "Verified";
      default:
        return "N/A";
    }
  };

  console.log(data);

  // Format table data
  const tableData = data?.data?.verificationRequests?.map(
    (verificationRequest: any) => ({
      ...verificationRequest,

      _id: verificationRequest?._id,
      userInfo: (
        <div className="space-y-0.5">
          <p className="font-semibold">
            {verificationRequest?.userName || "N/A"} <span className="text-primary-10">({verificationRequest?.tutorUniqueId || verificationRequest?.guardianUniqueId})</span>
          </p>
          <p className="text-sm text-gray-600">
            {verificationRequest?.userEmail || "N/A"}
          </p>
          <p className="text-sm text-gray-600">
            {verificationRequest?.userPhoneNumber || "N/A"}
          </p>
        </div>
      ),
      tutorId: verificationRequest?.tutorId,
      guardianUniqueId: verificationRequest?.guardianUniqueId,
      userRole: verificationRequest?.userRole,
      addressVerificationCode:
        verificationRequest?.addressVerificationCode ?? "N/A",
      generatedAddressVerificationCode:
        verificationRequest?.generatedAddressVerificationCode ?? "N/A",
      completedAt:
        verificationRequest?.completedAt !== null
          ? formatDate(verificationRequest?.completedAt as string)
          : "N/A",
      // Column: Date
      createdAt: formatDate(verificationRequest?.createdAt as string),

      // Column: Status
      status: (
        <p
          className={`capitalize px-2 py-1 rounded-xl w-fit font-Nunito ${
            statusStyles[verificationRequest?.status] ??
            "bg-red-100 text-red-600"
          }`}
        >
          {getVerificationStatusLabel(verificationRequest?.status)}
        </p>
      ),
    }),
  );

  const handleSearch = (q: string) => {
    setSearchQuery(q);
  };

  const statusFilterDropdown = (
    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      className="input input-sm px-3 py-2 border border-neutral-55/60 focus:border-primary-10 transition duration-300 focus:outline-none rounded-md text-sm shadow-sm cursor-pointer"
    >
      <option value="">All</option>
      <option value="pending">Pending</option>
      <option value="accepted">Accepted</option>
      <option value="rejected">Rejected</option>
    </select>
  );

  const handleAcceptRequest = async (verificationRequest: any) => {
    try {
      await toast.promise(acceptRequest(verificationRequest?._id).unwrap(), {
        loading: "Loading...",
        success: "Verification request accepted successfully!",
        error: "Failed to accept request. Please try again.",
      });
    } catch (err) {
      console.error("Something went wrong:", err);
    }
  };

  const handleReviewRequest = async (verificationRequest: any) => {
    try {
      await toast.promise(reviewRequest(verificationRequest?._id).unwrap(), {
        loading: "Loading...",
        success: "Status changed to reviewing.",
        error: "Failed to change status. Please try again.",
      });
    } catch (err) {
      console.error("Something went wrong:", err);
    }
  };

  const handleMarkAsInvoiceDue = async (verificationRequest: any) => {
    try {
      await toast.promise(markAsInvoiceDue(verificationRequest?._id).unwrap(), {
        loading: "Marking as invoice due...",
        success: "Status changed to invoice due.",
        error: "Failed to change status. Please try again.",
      });
    } catch (err) {
      console.error("Something went wrong:", err);
    }
  };

  const handleMarkAsAddressVerificationLetterSent = async (
    verificationRequest: any,
  ) => {
    try {
      await toast.promise(
        markAsAddressVerificationLetterSent(verificationRequest?._id).unwrap(),
        {
          loading: "Sending address verification letter...",
          success: "Address verification letter sent.",
          error: "Failed to change status. Please try again.",
        },
      );
    } catch (err) {
      console.error("Something went wrong:", err);
    }
  };

  const handleMarkAsVerified = async (verificationRequest: any) => {
    try {
      await toast.promise(markAsVerified(verificationRequest?._id).unwrap(), {
        loading: "Verifying request...",
        success: "Request marked as verified.",
        error: "Failed to change status. Please try again.",
      });
    } catch (err) {
      console.error("Something went wrong:", err);
    }
  };

  return (
    <div>
      <Table<any>
        title="All Profile Verification Requests"
        description="Manage all profile verification requests"
        theads={verificationRequestsTheads}
        data={tableData || []}
        totalPages={data?.data?.meta?.totalPages || 1}
        currentPage={page}
        onPageChange={(p) => setPage(p)}
        isLoading={isLoading || isFetching}
        onSearch={handleSearch}
        actions={actions}
        limit={limit}
        setLimit={setLimit}
        children={statusFilterDropdown}
        selectedCity={null}
        selectedArea={null}
      />
    </div>
  );
};

export default VerificationRequests;
