/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import InvoiceCard from "../../../../components/Dashboard/Tutor/InvoicePage/InvoiceCard/InvoiceCard";
import InvoicePreview from "../../../../components/Dashboard/Tutor/InvoicePage/InvoicePreview/InvoicePreview";
import Button from "../../../../components/Reusable/Button/Button";
import SendInvoiceForm from "../../../../components/Admin/InvoiceManagementPage/SendInvoiceForm/SendInvoiceForm";
import Modal from "../../../../components/Reusable/Modal/Modal";
import { useGetAllInvoicesQuery } from "../../../../redux/Features/Invoice/invoiceApi";
import type { TInvoice } from "../../../../types/invoice.types";
import Loader from "../../../../components/Reusable/Loader/Loader";
import NoData from "../../../../components/Reusable/NoData/NoData";
import LogoLoader from "../../../../components/Reusable/LogoLoader/LogoLoader";
import ErrorComponent from "../../../../components/Reusable/ErrorComponent/ErrorComponent";

const InvoiceManagement = () => {
  const [isSendInvoiceModalOpen, setIsSendInvoiceModalOpen] =
    useState<boolean>(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [status, setStatus] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");

  const {
    data: allInvoicesData,
    isLoading,
    isFetching,
    isError,
  } = useGetAllInvoicesQuery({ status, dueDate });

  const handleClearFilters = () => {
    setStatus("");
    setDueDate("");
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center font-Nunito">
        <LogoLoader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center font-Nunito">
        <ErrorComponent />
      </div>
    );
  }

  return (
    <div className="font-Nunito flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">
          Total Invoice ({allInvoicesData?.data?.length || 0})
        </h3>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="input input-sm px-3 py-2 border border-neutral-55/60 focus:border-primary-10 transition duration-300 focus:outline-none rounded-md text-sm shadow-sm cursor-pointer"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="input input-sm px-3 py-2 border border-neutral-55/60 focus:border-primary-10 transition duration-300 focus:outline-none rounded-md text-sm shadow-sm cursor-pointer"
          >
            <option value="">All Status</option>
            {["due", "paid"]?.map((status) => (
              <option key={status} value={status} className="capitalize">
                {status}
              </option>
            ))}
          </select>
          <Button
            label="Clear Filter"
            className="py-2.5 lg:py-2.5 px-3 lg:px-3 text-xs md:text-xs"
            onClick={handleClearFilters}
          />
          <Button
            label="Send Invoice"
            onClick={() => {
              setIsSendInvoiceModalOpen(true);
            }}
            className="px-3 lg:px-3 py-2 lg:py-2 border-none"
          />
        </div>
      </div>
      {isLoading || isFetching ? (
        <div className="py-10">
          <Loader size="lg" text="Please wait..." />
        </div>
      ) : !selectedInvoice ? (
        allInvoicesData?.data && allInvoicesData.data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4">
            {allInvoicesData.data.map((invoice: TInvoice) => (
              <InvoiceCard
                key={invoice._id}
                invoice={invoice}
                onSelect={setSelectedInvoice}
              />
            ))}
          </div>
        ) : (
          <NoData />
        )
      ) : (
        <InvoicePreview
          invoice={selectedInvoice}
          onBack={() => setSelectedInvoice(null)}
        />
      )}

      <Modal
        heading="Send Invoice"
        isModalOpen={isSendInvoiceModalOpen}
        setIsModalOpen={setIsSendInvoiceModalOpen}
        width="w-[90%] md:w-[30%] overflow-y-auto"
      >
        <SendInvoiceForm
          setIsSendInvoiceModalOpen={setIsSendInvoiceModalOpen}
        />
      </Modal>
    </div>
  );
};

export default InvoiceManagement;
