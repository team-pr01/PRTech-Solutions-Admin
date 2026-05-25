/* eslint-disable @typescript-eslint/no-explicit-any */
import { FiTrendingUp, FiTrendingDown, FiDollarSign } from "react-icons/fi";

type AccountKPICardProps = {
  type: "earnings" | "expenses" | "balance";
  currency: string;
  currencySymbol: string;
  amount: number;
  paidAmount?: number;
  pendingAmount?: number;
  status?: "positive" | "negative";
};

const AccountKPICard = ({
  type,
  currencySymbol,
  amount,
  paidAmount,
  pendingAmount,
  status,
}: AccountKPICardProps) => {
  const getCardConfig = () => {
    switch (type) {
      case "earnings":
        return {
          title: "Total Earnings",
          icon: FiTrendingUp,
          iconBg: "bg-green-100",
          iconColor: "text-green-600",
          amountColor: "text-gray-800",
          symbolColor: "text-green-600",
          gradient: "from-green-50 to-transparent",
        };
      case "expenses":
        return {
          title: "Total Expenses",
          icon: FiTrendingDown,
          iconBg: "bg-red-100",
          iconColor: "text-red-600",
          amountColor: "text-gray-800",
          symbolColor: "text-red-600",
          gradient: "from-red-50 to-transparent",
        };
      case "balance":
        return {
          title: "Net Balance",
          icon: FiDollarSign,
          iconBg: status === "positive" ? "bg-blue-100" : "bg-orange-100",
          iconColor: status === "positive" ? "text-blue-600" : "text-orange-600",
          amountColor: status === "positive" ? "text-blue-600" : "text-orange-600",
          symbolColor: status === "positive" ? "text-blue-600" : "text-orange-600",
          gradient: status === "positive" ? "from-blue-50 to-transparent" : "from-orange-50 to-transparent",
          borderColor: status === "positive" ? "border-blue-100" : "border-orange-100",
        };
    }
  };

  const config = getCardConfig();
  const Icon = config.icon;

  return (
    <div className={`group relative overflow-hidden bg-white rounded-2xl border shadow-sm hover:shadow-lg transition-all duration-300 ${
      type === "balance" ? config.borderColor : "border-gray-100"
    }`}>
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${config.gradient} rounded-full -mr-16 -mt-16`}></div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 ${config.iconBg} rounded-xl`}>
            <Icon className={config.iconColor} size={20} />
          </div>
          <span className={`text-2xl font-bold ${config.symbolColor}`}>{currencySymbol}</span>
        </div>
        
        <p className="text-sm text-gray-500 mb-1">{config.title}</p>
        <p className={`text-3xl font-bold mb-3 ${config.amountColor}`}>
          {amount?.toLocaleString() || 0}
        </p>
        
        {(type === "earnings" || type === "expenses") && (
          <div className="flex justify-between text-sm border-t border-gray-100 pt-3">
            <div>
              <span className="text-gray-400">Paid</span>
              <p className="text-green-600 font-semibold mt-0.5">
                {currencySymbol} {paidAmount?.toLocaleString() || 0}
              </p>
            </div>
            <div className="text-right">
              <span className="text-gray-400">Pending</span>
              <p className="text-yellow-600 font-semibold mt-0.5">
                {currencySymbol} {pendingAmount?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        )}
        
        {type === "balance" && (
          <div className="text-xs border-t border-gray-100 pt-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Status</span>
              <span className={`font-semibold ${status === "positive" ? "text-blue-600" : "text-orange-600"}`}>
                {status === "positive" ? "Positive" : "Negative"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountKPICard;