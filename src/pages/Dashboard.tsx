import { useDashboard } from "../features/dashboard/useDashboard";
import {
  FaBox,
  FaDollarSign,
  FaExclamationTriangle,
  FaClock,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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

  const formatCurrency = (amount: number) => `৳ ${amount.toLocaleString()}`;

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

  // Sample data for chart (replace with real API data if available)
  const chartData = [
    { name: "Mon", orders: 5, revenue: 1200 },
    { name: "Tue", orders: 8, revenue: 2500 },
    { name: "Wed", orders: 3, revenue: 900 },
    { name: "Thu", orders: 10, revenue: 3200 },
    { name: "Fri", orders: 7, revenue: 1800 },
    { name: "Sat", orders: 6, revenue: 1500 },
    { name: "Sun", orders: 4, revenue: 1100 },
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

      {/* SIMPLE ANALYTICS CHART */}
      <div className="mt-6 bg-white rounded-2xl border p-5 shadow-sm">
        <h3 className="text-sm text-gray-500 mb-4">
          Orders & Revenue (Weekly)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="orders"
              stroke="#3b82f6"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
