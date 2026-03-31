import { useOrders } from "../features/order/useOrders";

export default function Orders() {
  const { data, isLoading } = useOrders();

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Orders</h1>

      {data.map((order: any) => (
        <div key={order._id} className="card">
          <p>{order.customerName}</p>
          <p>Status: {order.status}</p>
          <p>Total: ${order.totalPrice}</p>
        </div>
      ))}
    </div>
  );
}
