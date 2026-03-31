import { useDashboard } from "../features/dashboard/useDashboard";

export default function Dashboard() {
  const { data, isLoading } = useDashboard();

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="card">Orders Today: {data.totalOrders}</div>
      <div className="card">Revenue: ${data.revenue}</div>
      <div className="card">Low Stock: {data.lowStock}</div>
      <div className="card">Pending: {data.pending}</div>
    </div>
  );
}
