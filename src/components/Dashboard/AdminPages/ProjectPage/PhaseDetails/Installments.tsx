/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { FiCalendar, FiClock } from "react-icons/fi";
import { formatDate } from "../../../../../utils/formatDate";
import { formatCurrency } from "../../../../../utils/formatCurrency";

export type TInstallment = {
  _id?: string;
  amount: number;
  date: Date;
  paymentMethod?:
    | "Cash"
    | "Bank Transfer"
    | "Credit Card"
    | "PayPal"
    | "bKash"
    | "Nagad"
    | "PhonePe"
    | "Google Pay"
    | "Payoneer"
    | "Other";
  receiver?: string;
  note?: string;
};

const Installments = ({
  expandedPhaseId,
  phase,
}: {
  expandedPhaseId: string | null;
  phase: any;
}) => {
  return (
    <AnimatePresence mode="wait">
      {expandedPhaseId === phase._id && phase?.installments?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden mt-6"
        >
          {phase?.installments?.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <FiClock className="mx-auto text-4xl text-gray-400 mb-3" />
              <p className="text-gray-500">
                No installments added for this phase
              </p>
            </div>
          ) : (
            <div className="space-y-3 w-full">
              {phase?.installments?.map(
                (installment: TInstallment, index: number) => (
                  <div
                    key={installment?._id || index}
                    className="border border-gray-200 bg-primary-10/5 rounded-lg p-4 w-full"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-semibold text-gray-800">
                        Installment {index + 1}
                      </p>
                      <p className="text-lg font-bold text-primary-10">
                        {formatCurrency(installment?.amount)}
                      </p>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-600 flex items-center gap-1">
                        <FiCalendar size={12} />
                        Date: {formatDate(installment?.date as any)}
                      </p>
                      {installment?.paymentMethod && (
                        <p className="text-gray-600">
                          Method: {installment?.paymentMethod}
                        </p>
                      )}
                      {installment?.receiver && (
                        <p className="text-gray-600">
                          Receiver: {installment?.receiver}
                        </p>
                      )}
                      {installment?.note && (
                        <p className="text-gray-500 text-xs mt-1 italic">
                          Note: {installment?.note}
                        </p>
                      )}
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Installments;
