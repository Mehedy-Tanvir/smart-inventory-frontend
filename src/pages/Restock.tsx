import { useRestock } from "../features/restock/useRestock";

export default function Restock() {
  const { data, isLoading } = useRestock();

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Restock Queue</h1>

      {data.map((item: any) => (
        <div key={item._id} className="card">
          <p>Product: {item.productId.name}</p>
          <p>Stock: {item.currentStock}</p>
          <p>Priority: {item.priority}</p>
        </div>
      ))}
    </div>
  );
}
