import { useDashboard } from "../features/dashboard/useDashboard";

export default function Dashboard() {
  const { data, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-gray-500 text-lg">Loading dashboard...</p>
      </div>
    );
  }

  const cards = [
    {
      title: "Orders Today",
      value: data.totalOrders,
    },
    {
      title: "Revenue",
      value: `$${data.revenue}`,
    },
    {
      title: "Low Stock Items",
      value: data.lowStock,
    },
    {
      title: "Pending Orders",
      value: data.pending,
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Dashboard Overview
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition"
          >
            <p className="text-sm text-gray-500 mb-2">{card.title}</p>
            <h2 className="text-2xl font-bold text-gray-800">{card.value}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
