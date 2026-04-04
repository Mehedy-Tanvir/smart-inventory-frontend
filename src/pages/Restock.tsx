import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import instance from "../services/api";

interface RestockItem {
  _id: string;
  productId: {
    _id: string;
    name: string;
    stock: number;
    minStockThreshold: number;
  };
  currentStock: number;
  priority: "High" | "Medium" | "Low";
}

export default function Restock() {
  const [data, setData] = useState<RestockItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RestockItem | null>(null);
  const [quantity, setQuantity] = useState("");

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await instance.get("/restock");

      const sorted = res.data.sort(
        (a: RestockItem, b: RestockItem) => a.currentStock - b.currentStock,
      );

      setData(sorted);
    } catch {
      toast.error("Failed to load restock queue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleRestockSubmit = async () => {
    if (!selectedItem) return;

    const qty = Number(quantity);
    if (!qty || qty <= 0) {
      toast.error("Enter valid quantity");
      return;
    }

    try {
      await instance.post(`/restock/restock`, {
        quantity: qty,
        productId: selectedItem.productId._id,
      });

      toast.success("Stock updated");
      setSelectedItem(null);
      setQuantity("");
      fetchQueue();
    } catch {
      toast.error("Restock failed");
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await instance.delete(`/restock/${id}`);
      toast.success("Removed from queue");
      fetchQueue();
    } catch {
      toast.error("Remove failed");
    }
  };

  const priorityStyle = (priority: string) => {
    if (priority === "High") return "bg-red-100 text-red-600";
    if (priority === "Medium") return "bg-yellow-100 text-yellow-600";
    return "bg-green-100 text-green-600";
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold">Restock Queue</h1>
        <p className="text-gray-500 text-sm">Manage low stock products</p>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <p className="p-6">Loading...</p>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 text-sm text-gray-600">
              <tr>
                <th className="text-left px-6 py-3">Product</th>
                <th className="text-center px-6 py-3">Stock</th>
                <th className="text-center px-6 py-3">Threshold</th>
                <th className="text-center px-6 py-3">Priority</th>
                <th className="text-right px-6 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item) => (
                <tr key={item._id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">
                    {item.productId.name}
                  </td>

                  <td className="px-6 py-4 text-center text-red-500 font-semibold">
                    {item.currentStock}
                  </td>

                  <td className="px-6 py-4 text-center">
                    {item.productId.minStockThreshold}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${priorityStyle(
                        item.priority,
                      )}`}
                    >
                      {item.priority}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="px-4 py-1.5 text-sm bg-black text-white rounded-lg"
                    >
                      Restock
                    </button>

                    <button
                      onClick={() => handleRemove(item._id)}
                      className="px-4 py-1.5 text-sm border rounded-lg"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {loading ? (
          <p>Loading...</p>
        ) : data.length === 0 ? (
          <p className="text-gray-500">No items</p>
        ) : (
          data.map((item) => (
            <div
              key={item._id}
              className="bg-white p-4 rounded-xl shadow-sm border"
            >
              <div className="flex justify-between items-start mb-2">
                <h2 className="font-semibold text-sm">{item.productId.name}</h2>

                <span
                  className={`px-2 py-1 text-xs rounded-full ${priorityStyle(
                    item.priority,
                  )}`}
                >
                  {item.priority}
                </span>
              </div>

              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  Stock:{" "}
                  <span className="text-red-500 font-semibold">
                    {item.currentStock}
                  </span>
                </p>
                <p>Threshold: {item.productId.minStockThreshold}</p>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setSelectedItem(item)}
                  className="flex-1 bg-black text-white py-2 rounded-lg text-sm"
                >
                  Restock
                </button>

                <button
                  onClick={() => handleRemove(item.productId._id)}
                  className="flex-1 border py-2 rounded-lg text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50">
          <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-2">Restock Product</h2>

            <p className="text-sm text-gray-500 mb-4">
              {selectedItem.productId.name}
            </p>

            <input
              type="number"
              placeholder="Enter quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-black"
            />

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedItem(null)}
                className="flex-1 border py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleRestockSubmit}
                className="flex-1 bg-black text-white py-2 rounded-lg"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
