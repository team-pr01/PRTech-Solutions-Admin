/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  FiEdit2,
  FiTrash2,
  FiTrendingUp,
  FiTrendingDown,
  FiClock,
} from "react-icons/fi";
import {
  useGetAccountSummaryQuery,
  useGetAllAccountsQuery,
} from "../../../../redux/Features/Accounts/accountsApi";
import { useDeleteAccountMutation } from "../../../../redux/Features/User/userApi";
import toast from "react-hot-toast";
import { formatDate } from "../../../../utils/formatDate";
import Button from "../../../../components/Reusable/Button/Button";
import Table from "../../../../components/Reusable/Table/Table";
import AddOrEditAccount from "../../../../components/Dashboard/AdminPages/AccountsPage/AddOrEditAccount/AddOrEditAccount";
import Modal from "../../../../components/Reusable/Modal/Modal";
import "react-circular-progressbar/dist/styles.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FiTarget, FiCalendar } from "react-icons/fi";
import AccountKPICard from "../../../../components/Dashboard/AccountsPage/AccountKPICard/AccountKPICard";

const Accounts = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [expenseTypeFilter, setExpenseTypeFilter] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit">("add");
  const [selectedAccountId, setSelectedAccountId] = useState<
    string | undefined
  >();

  const { data, isLoading, isFetching, refetch } = useGetAllAccountsQuery({
    page,
    limit,
    keyword: searchQuery,
    type: typeFilter,
    expenseType: expenseTypeFilter,
    date,
  });

  const { data: accountSummary } = useGetAccountSummaryQuery({});

  const [deleteAccount] = useDeleteAccountMutation();

  // Type style mapping
  const getTypeStyles = (type: string) => {
    if (type === "earning") {
      return "bg-green-100 text-green-700";
    }
    return "bg-red-100 text-red-700";
  };

  // Table headers
  const accountTableHeaders = [
    { key: "description", label: "Description" },
    { key: "type", label: "Type" },
    { key: "expenseType", label: "Expense Type" },
    { key: "amounts", label: "Amounts" },
    { key: "paymentInfo", label: "Payment Info" },
    { key: "date", label: "Date" },
  ];

  const handleDeleteAccount = async (id: string, description: string) => {
    if (window.confirm(`Are you sure you want to delete "${description}"?`)) {
      toast.promise(
        (async () => {
          await deleteAccount(id).unwrap();
          await refetch();
        })(),
        {
          loading: "Deleting transaction...",
          success: "Transaction deleted successfully",
          error: (error: any) =>
            error?.data?.message || "Failed to delete transaction",
        },
      );
    }
  };

  // Format currency
  const formatCurrency = (amount: number, currency: string) => {
    if (!currency || currency === "earnings" || currency === "expenses") {
      return `${currency} ${amount.toLocaleString()}`;
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format table data
  const tableData = data?.data?.data?.map((account: any) => ({
    ...account,
    _id: account._id,

    description: (
      <div className="space-y-1">
        <p className="font-medium text-gray-800">{account.description}</p>
        {account.note && (
          <p className="text-xs text-gray-500 truncate max-w-[200px]">
            {account.note}
          </p>
        )}
      </div>
    ),

    type: (
      <span
        className={`px-2 py-1 rounded-lg text-sm font-medium inline-flex items-center gap-1 ${getTypeStyles(account.type)}`}
      >
        {account.type === "earning" ? (
          <FiTrendingUp size={12} />
        ) : (
          <FiTrendingDown size={12} />
        )}
        {account.type === "earning" ? "Earning" : "Expense"}
      </span>
    ),

    expenseType: (
      <span className="capitalize px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm inline-block">
        {account.expenseType || "N/A"}
      </span>
    ),

    amounts: (
      <div className="space-y-1">
        <p className="font-semibold text-gray-800">
          Total: {formatCurrency(account.totalAmount, account.currency)}
        </p>
        {account.paidAmount > 0 && (
          <p className="text-sm text-green-600">
            Paid: {formatCurrency(account.paidAmount, account.currency)}
          </p>
        )}
        {account.pendingAmount > 0 && (
          <p className="text-sm text-red-600">
            Pending: {formatCurrency(account.pendingAmount, account.currency)}
          </p>
        )}
      </div>
    ),

    paymentInfo: (
      <div className="space-y-1 text-sm">
        <p className="text-gray-700">
          <span className="font-medium">Method:</span> {account.paymentMethod}
        </p>
        {account.paidBy && (
          <p className="text-gray-600">
            <span className="font-medium">Paid by:</span> {account.paidBy}
          </p>
        )}
      </div>
    ),

    date: formatDate(account.date),
  }));

  // Actions
  const actions: any[] = [
    {
      label: "Edit",
      icon: <FiEdit2 className="inline text-green-600" />,
      onClick: (row: any) => {
        setModalType("edit");
        setSelectedAccountId(row._id);
        setShowModal(true);
      },
    },
    {
      label: "Delete",
      icon: <FiTrash2 className="inline text-red-600" />,
      onClick: (row: any) => {
        handleDeleteAccount(row._id, row.description);
      },
    },
  ];

  const handleSearch = (q: string) => {
    setSearchQuery(q);
  };

  const handleAddAccount = () => {
    setModalType("add");
    setSelectedAccountId(undefined);
    setShowModal(true);
  };

  // Get summary data
  const summary = accountSummary?.data || {};

  // Filters
  const typeFilterDropdown = (
    <select
      value={typeFilter}
      onChange={(e) => setTypeFilter(e.target.value)}
      className="input input-sm px-3 py-2 border border-neutral-55/60 focus:border-primary-10 transition duration-300 focus:outline-none rounded-md text-sm shadow-sm cursor-pointer"
    >
      <option value="">All Types</option>
      <option value="earning">Earning</option>
      <option value="expense">Expense</option>
    </select>
  );

  const expenseTypeFilterDropdown = (
    <select
      value={expenseTypeFilter}
      onChange={(e) => setExpenseTypeFilter(e.target.value)}
      className="input input-sm px-3 py-2 border border-neutral-55/60 focus:border-primary-10 transition duration-300 focus:outline-none rounded-md text-sm shadow-sm cursor-pointer"
      disabled={typeFilter === "earning"}
    >
      <option value="">All Expense Types</option>
      <option value="salary">Salary</option>
      <option value="ui/ux">UI/UX</option>
      <option value="tools">Tools</option>
      <option value="graphics">Graphics</option>
      <option value="deployment">Deployment</option>
      <option value="other">Other</option>
    </select>
  );

  const dateFilter = (
    <input
      type="date"
      value={date}
      onChange={(e) => setDate(e.target.value)}
      className="input input-sm px-3 py-2 border border-neutral-55/60 focus:border-primary-10 transition duration-300 focus:outline-none rounded-md text-sm shadow-sm"
    />
  );

  const filters = (
    <div className="flex flex-wrap gap-2">
      {typeFilterDropdown}
      {expenseTypeFilterDropdown}
      {dateFilter}
      <Button onClick={handleAddAccount} label="Add Transaction" />
    </div>
  );

  // Add after the summary constant
  const targetAmount = 5000000; // 50 lac BDT
  const currentEarnings = summary?.BDT?.earnings?.total || 0;
  const progressPercentage = Math.min(
    Math.floor((currentEarnings / targetAmount) * 100),
    100,
  );
  const remainingAmount = Math.max(targetAmount - currentEarnings, 0);

  // Time remaining calculation
  const targetDate = new Date(2027, 11, 31); // Dec 31, 2027
  const now = new Date();
  const diffTime = targetDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const monthsRemaining = Math.floor(diffDays / 30);
  const daysRemaining = diffDays % 30;

  let timeRemaining = "";
  if (monthsRemaining > 0) {
    timeRemaining = `${monthsRemaining} month${monthsRemaining > 1 ? "s" : ""} ${daysRemaining > 0 ? `${daysRemaining} day${daysRemaining > 1 ? "s" : ""}` : ""}`;
  } else {
    timeRemaining = `${diffDays} day${diffDays !== 1 ? "s" : ""}`;
  }
  if (diffDays < 0) timeRemaining = "Target date passed";

  // Monthly chart data - this should come from an API
  // We'll create a placeholder and add a comment
  const [monthlyData, setMonthlyData] = useState<any>([]);
  // Fetch monthly summary from a new endpoint
  useEffect(() => {
    // Replace with actual API call
    // fetchMonthlySummary().then(res => setMonthlyData(res.data));
    // For now, use mock data
    setMonthlyData([
      { month: "Jan", earnings: 120000, expenses: 80000 },
      { month: "Feb", earnings: 150000, expenses: 95000 },
      { month: "Mar", earnings: 180000, expenses: 110000 },
      { month: "Apr", earnings: 200000, expenses: 130000 },
      { month: "May", earnings: 220000, expenses: 140000 },
      { month: "Jun", earnings: 250000, expenses: 160000 },
      { month: "Jul", earnings: 280000, expenses: 180000 },
      { month: "Aug", earnings: 300000, expenses: 190000 },
      { month: "Sep", earnings: 320000, expenses: 200000 },
      { month: "Oct", earnings: 340000, expenses: 210000 },
      { month: "Nov", earnings: 360000, expenses: 220000 },
      { month: "Dec", earnings: 400000, expenses: 250000 },
    ]);
  }, []);

  return (
    <div className="space-y-6">
      {/* KPI Cards - Dynamic Mapping */}
      <div className="space-y-8">
        {[
          { currency: "BDT", symbol: "৳", data: summary?.BDT },
          { currency: "INR", symbol: "₹", data: summary?.INR },
        ].map((currencyItem) => (
          <div key={currencyItem?.currency} className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-primary-10 rounded-full"></div>
              <h3 className="text-lg font-semibold text-gray-800">
                {currencyItem?.currency} Financial Summary
              </h3>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {currencyItem?.currency === "BDT"
                  ? "Bangladeshi Taka"
                  : "Indian Rupee"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Earnings Card */}
              <AccountKPICard
                type="earnings"
                currency={currencyItem?.currency}
                currencySymbol={currencyItem?.symbol}
                amount={currencyItem?.data?.earnings?.total}
                paidAmount={currencyItem?.data?.earnings?.paid}
                pendingAmount={currencyItem?.data?.earnings?.pending}
              />

              {/* Expenses Card */}
              <AccountKPICard
                type="expenses"
                currency={currencyItem?.currency}
                currencySymbol={currencyItem?.symbol}
                amount={currencyItem?.data?.expenses?.total}
                paidAmount={currencyItem?.data?.expenses?.paid}
                pendingAmount={currencyItem?.data?.expenses?.pending}
              />

              {/* Balance Card */}
              <AccountKPICard
                type="balance"
                currency={currencyItem?.currency}
                currencySymbol={currencyItem?.symbol}
                amount={Math.abs(currencyItem?.data?.balance)}
                status={
                  currencyItem?.data?.balance >= 0 ? "positive" : "negative"
                }
              />
            </div>
          </div>
        ))}

        {/* Compact Pending Summary */}
        <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-xl">
                <FiClock className="text-yellow-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending Earnings</p>
                <div className="flex gap-4 mt-1">
                  <span className="text-sm font-semibold text-gray-700">
                    BDT: ৳{" "}
                    {summary?.BDT?.earnings?.pending?.toLocaleString() || 0}
                  </span>
                  <span className="text-sm font-semibold text-gray-700">
                    INR: ₹{" "}
                    {summary?.INR?.earnings?.pending?.toLocaleString() || 0}
                  </span>
                </div>
              </div>
            </div>
            <div className="w-px h-10 bg-gray-200 hidden md:block"></div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-xl">
                <FiClock className="text-orange-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending Expenses</p>
                <div className="flex gap-4 mt-1">
                  <span className="text-sm font-semibold text-gray-700">
                    BDT: ৳{" "}
                    {summary?.BDT?.expenses?.pending?.toLocaleString() || 0}
                  </span>
                  <span className="text-sm font-semibold text-gray-700">
                    INR: ₹{" "}
                    {summary?.INR?.expenses?.pending?.toLocaleString() || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Goal Progress Section - Professional */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
          {/* Header with gradient accent */}
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-2 rounded-lg">
                  <FiTarget className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Financial Goal</h3>
                  <p className="text-white/80 text-sm">
                    BDT 50 Lac by Dec 2027
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white/70 text-xs">Target Date</p>
                <p className="text-white font-medium text-sm">
                  December 31, 2027
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Main Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Achieved</p>
                <p className="text-xl font-bold text-blue-600">
                  ৳ {(currentEarnings / 100000).toFixed(1)}L
                </p>
                <p className="text-xs text-gray-400">
                  {currentEarnings.toLocaleString()} BDT
                </p>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Remaining</p>
                <p className="text-xl font-bold text-orange-600">
                  ৳ {(remainingAmount / 100000).toFixed(1)}L
                </p>
                <p className="text-xs text-gray-400">
                  {remainingAmount.toLocaleString()} BDT
                </p>
              </div>
            </div>

            {/* Progress Bar with percentage */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Overall Progress</span>
                <span className="font-semibold text-primary-10">
                  {progressPercentage}%
                </span>
              </div>
              <div className="relative">
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary-10 to-primary-20 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                {/* Milestone markers */}
                <div className="absolute -bottom-4 left-0 right-0 flex justify-between px-1">
                  {[25, 50, 75].map((mark) => (
                    <div key={mark} className="relative">
                      <div className="w-0.5 h-2 bg-gray-300"></div>
                      <span className="text-xs text-gray-400 absolute -top-5 -translate-x-1/2">
                        {mark}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Time & Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <FiCalendar className="text-purple-600" size={16} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Time Left</p>
                  <p className="font-semibold text-gray-800 text-sm">
                    {timeRemaining}
                  </p>
                  <p className="text-xs text-gray-400">
                    {daysRemaining} days remaining
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-50 rounded-lg">
                  <FiTrendingUp className="text-green-600" size={16} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Monthly Target</p>
                  <p className="font-semibold text-gray-800 text-sm">
                    ৳ {(targetAmount / 36).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">
                    ~{(targetAmount / 36 / 100000).toFixed(1)}L per month
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Chart Section - Professional */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col">
          <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-primary-10/10 p-2 rounded-lg">
                  <FiTrendingUp className="text-primary-10" size={20} />
                </div>
                <div>
                  <h3 className="text-gray-800 font-semibold">
                    Monthly Overview
                  </h3>
                  <p className="text-gray-500 text-sm">Earnings vs Expenses</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Earnings</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Expenses</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 flex-1">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart
                data={monthlyData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                  axisLine={{ stroke: "#E5E7EB" }}
                />
                <YAxis
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                  axisLine={{ stroke: "#E5E7EB" }}
                  tickFormatter={(value) => `৳${value / 1000}K`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    padding: "8px 12px",
                  }}
                  formatter={(value: number) => [
                    `৳ ${value.toLocaleString()}`,
                    "",
                  ]}
                />
                <Legend wrapperStyle={{ paddingTop: "16px" }} />
                <Line
                  type="monotone"
                  dataKey="earnings"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Earnings"
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#EF4444"
                  strokeWidth={2.5}
                  dot={{ fill: "#EF4444", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Expenses"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Summary Stats at bottom */}
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
            <div className="flex justify-between items-center text-sm">
              <div>
                <span className="text-gray-500">Avg Monthly Earnings: </span>
                <span className="font-semibold text-green-600">
                  ৳{" "}
                  {Math.round(
                    monthlyData.reduce(
                      (acc: any, curr: any) => acc + curr.earnings,
                      0,
                    ) / monthlyData.length || 0,
                  ).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Avg Monthly Expenses: </span>
                <span className="font-semibold text-red-600">
                  ৳{" "}
                  {Math.round(
                    monthlyData.reduce(
                      (acc: any, curr: any) => acc + curr.expenses,
                      0,
                    ) / monthlyData.length || 0,
                  ).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <Table
        title="All Transactions"
        description="Manage your earnings and expenses"
        theads={accountTableHeaders}
        data={tableData || []}
        totalPages={data?.data?.meta?.totalPages || 1}
        currentPage={page}
        onPageChange={(p) => setPage(p)}
        isLoading={isLoading || isFetching}
        onSearch={handleSearch}
        actions={actions}
        limit={limit}
        setLimit={setLimit}
        children={filters}
        selectedCity={null}
        selectedArea={null}
      />

      <Modal
        heading={modalType === "add" ? "Add Transaction" : "Edit Transaction"}
        isModalOpen={showModal}
        setIsModalOpen={setShowModal}
      >
        <AddOrEditAccount
          accountId={selectedAccountId}
          modalType={modalType}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            refetch();
            setShowModal(false);
          }}
        />
      </Modal>
    </div>
  );
};

export default Accounts;
