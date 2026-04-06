/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  FiEdit2,
  FiTrash2,
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
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

  return (
    <div className="space-y-6">
      {/* KPI Cards - BDT Section */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-800">BDT Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Earnings Card BDT */}
          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm text-gray-600">Total Earnings</p>
              <FiTrendingUp className="text-green-600" size={20} />
            </div>
            <p className="text-2xl font-bold text-green-600">
              ৳ {summary?.BDT?.earnings?.total?.toLocaleString() || 0}
            </p>
            <div className="mt-2 text-xs text-gray-500">
              <span>
                Paid: ৳ {summary?.BDT?.earnings?.paid?.toLocaleString() || 0}
              </span>
              <span className="ml-2">
                Pending: ৳{" "}
                {summary?.BDT?.earnings?.pending?.toLocaleString() || 0}
              </span>
            </div>
          </div>

          {/* Expenses Card BDT */}
          <div className="bg-red-50 rounded-xl p-6 border border-red-200">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm text-gray-600">Total Expenses</p>
              <FiTrendingDown className="text-red-600" size={20} />
            </div>
            <p className="text-2xl font-bold text-red-600">
              ৳ {summary?.BDT?.expenses?.total?.toLocaleString() || 0}
            </p>
            <div className="mt-2 text-xs text-gray-500">
              <span>
                Paid: ৳ {summary?.BDT?.expenses?.paid?.toLocaleString() || 0}
              </span>
              <span className="ml-2">
                Pending: ৳{" "}
                {summary?.BDT?.expenses?.pending?.toLocaleString() || 0}
              </span>
            </div>
          </div>

          {/* Balance Card BDT */}
          <div
            className={`${summary?.BDT?.balance >= 0 ? "bg-blue-50 border-blue-200" : "bg-orange-50 border-orange-200"} rounded-xl p-6 border`}
          >
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm text-gray-600">Net Balance</p>
              <FiDollarSign
                className={
                  summary?.BDT?.balance >= 0
                    ? "text-blue-600"
                    : "text-orange-600"
                }
                size={20}
              />
            </div>
            <p
              className={`text-2xl font-bold ${summary?.BDT?.balance >= 0 ? "text-blue-600" : "text-orange-600"}`}
            >
              ৳ {Math.abs(summary?.BDT?.balance || 0).toLocaleString()}
              {summary?.BDT?.balance < 0 && (
                <span className="text-sm ml-1">(Negative)</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards - INR Section */}
      <div className="space-y-3 mt-6">
        <h3 className="text-lg font-semibold text-gray-800">INR Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Earnings Card INR */}
          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm text-gray-600">Total Earnings</p>
              <FiTrendingUp className="text-green-600" size={20} />
            </div>
            <p className="text-2xl font-bold text-green-600">
              ₹ {summary?.INR?.earnings?.total?.toLocaleString() || 0}
            </p>
            <div className="mt-2 text-xs text-gray-500">
              <span>
                Paid: ₹ {summary?.INR?.earnings?.paid?.toLocaleString() || 0}
              </span>
              <span className="ml-2">
                Pending: ₹{" "}
                {summary?.INR?.earnings?.pending?.toLocaleString() || 0}
              </span>
            </div>
          </div>

          {/* Expenses Card INR */}
          <div className="bg-red-50 rounded-xl p-6 border border-red-200">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm text-gray-600">Total Expenses</p>
              <FiTrendingDown className="text-red-600" size={20} />
            </div>
            <p className="text-2xl font-bold text-red-600">
              ₹ {summary?.INR?.expenses?.total?.toLocaleString() || 0}
            </p>
            <div className="mt-2 text-xs text-gray-500">
              <span>
                Paid: ₹ {summary?.INR?.expenses?.paid?.toLocaleString() || 0}
              </span>
              <span className="ml-2">
                Pending: ₹{" "}
                {summary?.INR?.expenses?.pending?.toLocaleString() || 0}
              </span>
            </div>
          </div>

          {/* Balance Card INR */}
          <div
            className={`${summary?.INR?.balance >= 0 ? "bg-blue-50 border-blue-200" : "bg-orange-50 border-orange-200"} rounded-xl p-6 border`}
          >
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm text-gray-600">Net Balance</p>
              <FiDollarSign
                className={
                  summary?.INR?.balance >= 0
                    ? "text-blue-600"
                    : "text-orange-600"
                }
                size={20}
              />
            </div>
            <p
              className={`text-2xl font-bold ${summary?.INR?.balance >= 0 ? "text-blue-600" : "text-orange-600"}`}
            >
              ₹ {Math.abs(summary?.INR?.balance || 0).toLocaleString()}
              {summary?.INR?.balance < 0 && (
                <span className="text-sm ml-1">(Negative)</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Pending Amounts Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {/* Pending Earnings */}
        <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm text-gray-600">Pending Earnings</p>
            <FiClock className="text-yellow-600" size={20} />
          </div>
          <div className="space-y-1">
            <p className="text-md font-medium">
              BDT: ৳ {summary?.BDT?.earnings?.pending?.toLocaleString() || 0}
            </p>
            <p className="text-md font-medium">
              INR: ₹ {summary?.INR?.earnings?.pending?.toLocaleString() || 0}
            </p>
          </div>
        </div>

        {/* Pending Expenses */}
        <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm text-gray-600">Pending Expenses</p>
            <FiClock className="text-orange-600" size={20} />
          </div>
          <div className="space-y-1">
            <p className="text-md font-medium">
              BDT: ৳ {summary?.BDT?.expenses?.pending?.toLocaleString() || 0}
            </p>
            <p className="text-md font-medium">
              INR: ₹ {summary?.INR?.expenses?.pending?.toLocaleString() || 0}
            </p>
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
