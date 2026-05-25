  // Status badge color mapping
  export const getPhaseStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Pending: "bg-yellow-100 text-yellow-700",
      "Yet to Start": "bg-gray-100 text-gray-700",
      Ongoing: "bg-blue-100 text-blue-700",
      "On Hold": "bg-orange-100 text-orange-700",
      Completed: "bg-green-100 text-green-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  // Payment status badge color
  export const getPaymentStatusColor = (status: string) => {
    return status === "Paid"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";
  };