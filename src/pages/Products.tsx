import { useProducts } from "../features/product/useProducts";

export default function Products() {
  const { data, isLoading } = useProducts();

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Products</h1>

      {data.map((p: any) => (
        <div key={p._id} className="card">
          <p>{p.name}</p>
          <p>Stock: {p.stock}</p>
          <p>Status: {p.status}</p>
        </div>
      ))}
    </div>
  );
}
