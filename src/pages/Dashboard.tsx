import { useDashboard } from "../features/dashboard/useDashboard";
import {
  FaBox,
  FaDollarSign,
  FaExclamationTriangle,
  FaClock,
} from "react-icons/fa";

export default function Dashboard() {
  const { data, isLoading } = useDashboard();

  const dashboard = data?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-gray-500 text-lg">Loading dashboard...</p>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="p-6">
        <p className="text-red-500">Failed to load dashboard data</p>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return `৳ ${amount.toLocaleString()}`;
  };

  const cards = [
    {
      title: "Orders Today",
      value: dashboard.totalOrdersToday,
      icon: <FaBox />,
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      title: "Revenue Today",
      value: formatCurrency(dashboard.revenueToday),
      icon: <FaDollarSign />,
      bg: "bg-green-50",
      text: "text-green-600",
    },
    {
      title: "Low Stock Items",
      value: dashboard.lowStockProducts,
      icon: <FaExclamationTriangle />,
      bg: "bg-red-50",
      text: "text-red-600",
    },
    {
      title: "Pending Orders",
      value: dashboard.pendingOrders,
      icon: <FaClock />,
      bg: "bg-yellow-50",
      text: "text-yellow-600",
    },
  ];

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Dashboard
        </h1>
        <p className="text-gray-500 text-sm">
          Overview of your inventory and orders
        </p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-lg ${card.bg} ${card.text}`}
              >
                {card.icon}
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-1">{card.title}</p>

            <h2 className="text-2xl font-bold text-gray-800">{card.value}</h2>
          </div>
        ))}
      </div>

      {/* SECONDARY STATS */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border p-5 shadow-sm">
          <h3 className="text-sm text-gray-500 mb-2">Completed Orders</h3>
          <p className="text-xl font-semibold text-gray-800">
            {dashboard.completedOrders}
          </p>
        </div>

        <div className="bg-white rounded-2xl border p-5 shadow-sm">
          <h3 className="text-sm text-gray-500 mb-2">Pending Orders</h3>
          <p className="text-xl font-semibold text-gray-800">
            {dashboard.pendingOrders}
          </p>
        </div>
      </div>
    </div>
  );
}
