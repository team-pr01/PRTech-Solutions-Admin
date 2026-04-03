/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { FiCheck, FiX } from "react-icons/fi";
import type {
  TableAction,
  TableHead,
} from "../../../../components/Reusable/Table/Table";
import Table from "../../../../components/Reusable/Table/Table";
import {
  useGetAllPaymentsQuery,
  useUpdatePaymentStatusMutation,
} from "../../../../redux/Features/Payment/paymentApi";
import { formatDate } from "../../../../utils/formatDate";
import type { TPayment } from "../../../../types/payment.types";
import toast from "react-hot-toast";

const PaymentsManagement = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedPaymentProof, setSelectedPaymentProof] = useState<
    string | null
  >(null);
  const [isProofModalOpen, setIsProofModalOpen] = useState<boolean>(false);
  const { data, isLoading, isFetching } = useGetAllPaymentsQuery({
    page,
    limit,
    status: statusFilter,
    keyword: searchQuery,
  });
  const [updatePaymentStatus] = useUpdatePaymentStatusMutation();

  // Table headers
  const paymentTheads: TableHead[] = [
    { key: "senderName", label: "Sender Name" },
    { key: "senderAccountNumber", label: "Sender Account" },
    { key: "transactionId", label: "Transaction ID" },
    { key: "paymentMethod", label: "Payment Method" },
    { key: "amount", label: "Amount" },
    { key: "invoiceId", label: "Invoice ID" },
    { key: "createdAt", label: "Date" },
    { key: "paymentProof", label: "Payment Proof" },
    { key: "status", label: "Status" },
  ];

  // Actions
  const actions: TableAction<any>[] = [
    {
      label: "Approve",
      icon: <FiCheck className="inline text-green-600" />,
      onClick: (row) => {
        handleUpdatePaymentStatus(
          {
            id: row?._id,
            userId: row?.userId,
            invoiceId: row?.invoiceId,
            paidFor: row?.paidFor,
          },
          "approved",
        );
      },
    },
    {
      label: "Reject",
      icon: <FiX className="inline text-red-600" />,
      onClick: (row) => {
        handleUpdatePaymentStatus(
          {
            id: row?._id,
            userId: row?.userId,
            invoiceId: row?.invoiceId,
            paidFor: row?.paidFor,
          },
          "rejected",
        );
      },
    },
  ];

  // Format table data
  const tableData = data?.data?.payments?.map((payment: TPayment) => ({
    ...payment,
    senderName: (
      <p>
        {payment?.userId?.name} <br /> {payment?.userId?.phoneNumber}
      </p>
    ),
    amount: `${payment.amount} BDT`,
    invoiceId: payment.invoiceId, // just for updating status
    paidFor: payment.paidFor,
    transactionId: payment?.transactionId ? payment?.transactionId : "N/A",
    createdAt: formatDate(payment?.createdAt as string),
    status: (
      <p
        className={`capitalize px-2 py-1 rounded-xl w-fit font-Nunito ${
          payment?.status === "approved"
            ? "bg-green-100 text-green-600"
            : payment?.status === "pending"
              ? "bg-yellow-100 text-yellow-600"
              : "bg-red-100 text-red-600"
        }`}
      >
        {payment?.status}
      </p>
    ),

    paymentProof: (
      <button
        className="text-primary-10 underline cursor-pointer"
        onClick={() => {
          setSelectedPaymentProof(payment?.imageUrl);
          setIsProofModalOpen(true);
        }}
      >
        {payment?.imageUrl ? "View Proof" : "N/A"}
      </button>
    ),
  }));

  const handleSearch = (q: string) => {
    setSearchQuery(q);
  };

  const statusFilterDropdown = (
    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      className="input input-sm px-3 py-2 border border-neutral-55/60 focus:border-primary-10 transition duration-300 focus:outline-none rounded-md text-sm shadow-sm cursor-pointer"
    >
      <option value="">All Payments</option>
      <option value="pending">Pending</option>
      <option value="approved">Approved</option>
    </select>
  );

  const handleUpdatePaymentStatus = async (
    payment: any,
    status: "approved" | "rejected",
  ) => {
    try {
      const payload = {
        userId: payment?.userId?._id,
        invoiceId: payment?.invoiceId,
        paidFor: payment?.paidFor,
        status,
      };

      await toast.promise(
        updatePaymentStatus({ id: payment?.id, data: payload }).unwrap(),
        {
          loading: "Loading...",
          success:
            status === "approved"
              ? "Payment approved successfully!"
              : "Payment rejected successfully!",
          error: `Failed to ${status} payment. Please try again.`,
        },
      );
    } catch (err) {
      console.error("Error updating payment:", err);
    }
  };

  return (
    <div>
      <Table<any>
        title="All Payments"
        description="Manage all payments on the platform."
        theads={paymentTheads}
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

      {isProofModalOpen && selectedPaymentProof && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-9999">
          {/* Close Button */}
          <button
            onClick={() => setIsProofModalOpen(false)}
            className="absolute size-10 top-5 right-5 text-white text-2xl p-2 rounded-full hover:bg-gray-800 transition flex items-center justify-center cursor-pointer"
          >
            ✕
          </button>

          {/* Fullscreen Image */}
          <img
            src={selectedPaymentProof}
            alt="Payment Proof"
            className="max-h-full max-w-full object-contain rounded-md shadow-lg"
          />
        </div>
      )}
    </div>
  );
};

export default PaymentsManagement;
