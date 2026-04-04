import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import instance from "../services/api";

export default function Orders() {
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const [customerName, setCustomerName] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);

  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  // Format date for display
  const formatDate = (date: string) => {
    const d = new Date(date);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
  };

  // Fetch products and orders on mount
  const fetchProducts = async () => {
    const res = await instance.get("/products");
    setProducts(res.data.data || res.data || []);
  };

  const fetchOrders = async () => {
    const res = await instance.get("/orders");
    setOrders(res.data.data || res.data || []);
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchProducts();
      await fetchOrders();
    };
    loadData();
  }, []);

  // Add product to order with duplicate check
  const addProduct = (productId: string) => {
    if (!productId) return;

    const exists = selectedProducts.find((p) => p.productId === productId);
    if (exists) {
      toast.error("Product already added");
      return;
    }

    setSelectedProducts([...selectedProducts, { productId, quantity: 1 }]);
  };

  // Update quantity for a selected product
  const updateQuantity = (index: number, qty: number) => {
    const updated = [...selectedProducts];
    updated[index].quantity = qty;
    setSelectedProducts(updated);
  };

  // Total price calculation
  const totalPrice = selectedProducts.reduce((total, item) => {
    const product = products.find((p) => p._id === item.productId);
    return total + (product?.price || 0) * item.quantity;
  }, 0);

  // Create order with validation
  const createOrder = async () => {
    if (!customerName) return toast.error("Customer name required");
    if (!selectedProducts.length)
      return toast.error("Add at least one product");

    try {
      await instance.post("/orders", {
        customerName,
        products: selectedProducts,
      });

      toast.success("Order created");
      setCustomerName("");
      setSelectedProducts([]);
      fetchOrders();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed");
    }
  };

  // Status update with validation
  const updateStatus = async (
    id: string,
    status: string,
    currentStatus: string,
  ) => {
    try {
      if (status === "Confirmed") {
        if (currentStatus !== "Pending") {
          return toast.error("Only pending orders can be confirmed");
        }
        await confirmOrder(id);
      }

      if (status === "Shipped") {
        if (currentStatus !== "Confirmed") {
          return toast.error("Only confirmed orders can be shipped");
        }
        await shipOrder(id);
      }

      if (status === "Delivered") {
        if (currentStatus !== "Shipped") {
          return toast.error("Only shipped orders can be delivered");
        }
        await deliverOrder(id);
      }

      if (status === "Cancelled") {
        await cancelOrder(id);
      }
    } catch {
      toast.error("Failed");
    }
  };

  const confirmOrder = async (id: string) => {
    try {
      await instance.patch(`/orders/${id}/confirm`);
      toast.success("Order confirmed");
      fetchOrders();
    } catch {
      toast.error("Failed to confirm order");
    }
  };

  const shipOrder = async (id: string) => {
    try {
      await instance.patch(`/orders/${id}/ship`);
      toast.success("Order shipped");
      fetchOrders();
    } catch {
      toast.error("Failed to ship order");
    }
  };

  const deliverOrder = async (id: string) => {
    try {
      await instance.patch(`/orders/${id}/deliver`);
      toast.success("Order delivered");
      fetchOrders();
    } catch {
      toast.error("Failed to deliver order");
    }
  };

  const cancelOrder = async (id: string) => {
    try {
      await instance.patch(`/orders/${id}/cancel`);
      toast.success("Order cancelled");
      fetchOrders();
    } catch {
      toast.error("Cancel failed");
    }
  };

  // Filtering Logic
  const filteredOrders = orders.filter((order) => {
    const matchStatus = statusFilter ? order.status === statusFilter : true;

    const orderDate = new Date(order.createdAt);
    const matchStart = startDate ? orderDate >= new Date(startDate) : true;
    const matchEnd = endDate
      ? orderDate <= new Date(endDate + "T23:59:59")
      : true;

    return matchStatus && matchStart && matchEnd;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage,
  );

  // Status badge styles
  const getStatusStyle = (status: string) => {
    const map: any = {
      Pending: "bg-yellow-100 text-yellow-700",
      Confirmed: "bg-blue-100 text-blue-700",
      Shipped: "bg-purple-100 text-purple-700",
      Delivered: "bg-green-100 text-green-700",
      Cancelled: "bg-red-100 text-red-700",
    };
    return map[status] || "bg-gray-100";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Order Management</h1>
        <p className="text-gray-500 text-sm">
          Create and manage customer orders.
        </p>
      </div>

      {/* Create Order */}
      <div className="bg-white p-5 rounded-xl border shadow-sm">
        <h2 className="font-semibold mb-3">Create Order</h2>

        <input
          placeholder="Customer Name"
          className="input-modern mb-3"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />

        <select
          className="input-modern mb-3"
          onChange={(e) => addProduct(e.target.value)}
        >
          <option value="">Add Product</option>
          {products.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name} (${p.price})
            </option>
          ))}
        </select>

        {selectedProducts.map((item, i) => {
          const product = products.find((p) => p._id === item.productId);
          return (
            <div key={i} className="flex justify-between mb-2">
              <span>{product?.name}</span>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => updateQuantity(i, Number(e.target.value))}
                className="w-20 border px-2"
              />
            </div>
          );
        })}

        <div className="mt-2 font-semibold">
          Total: ${totalPrice.toFixed(2)}
        </div>

        <button
          onClick={createOrder}
          className="mt-3 cursor-pointer bg-black text-white px-4 py-2 rounded"
        >
          Create Order
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <select
          className="input-modern"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All</option>
          <option>Pending</option>
          <option>Confirmed</option>
          <option>Shipped</option>
          <option>Delivered</option>
          <option>Cancelled</option>
        </select>

        <input
          type="date"
          className="input-modern"
          value={startDate}
          onChange={(e) => {
            setStartDate(e.target.value);
            setCurrentPage(1);
          }}
        />

        <input
          type="date"
          className="input-modern"
          value={endDate}
          onChange={(e) => {
            setEndDate(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <p className="text-gray-500 text-sm">
        Click on any row to see full order details.
      </p>

      {/* Table */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {paginatedOrders.map((order) => (
              <FragmentWrapper key={order._id}>
                <tr
                  className="border-t cursor-pointer hover:bg-gray-50"
                  onClick={() =>
                    setExpandedOrder(
                      expandedOrder === order._id ? null : order._id,
                    )
                  }
                >
                  <td className="p-3">{order.customerName}</td>
                  <td className="p-3">${order.totalPrice}</td>
                  <td className="p-3 text-xs">{formatDate(order.createdAt)}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${getStatusStyle(
                        order.status,
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="p-3">
                    <select
                      className="border px-2 py-1 rounded"
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        updateStatus(order._id, e.target.value, order.status)
                      }
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Actions
                      </option>
                      <option value="Confirmed">Confirm</option>
                      <option value="Shipped">Ship</option>
                      <option value="Delivered">Deliver</option>
                      <option value="Cancelled">Cancel</option>
                    </select>
                  </td>
                </tr>

                {expandedOrder === order._id && (
                  <tr className="bg-gray-50">
                    <td colSpan={5} className="p-4">
                      {order.products.map((item: any) => (
                        <div
                          key={item._id}
                          className="flex justify-between border p-2 rounded mb-2"
                        >
                          <span>
                            {item.productId?.name} × {item.quantity}
                          </span>
                          <span>${item.price * item.quantity}</span>
                        </div>
                      ))}
                    </td>
                  </tr>
                )}
              </FragmentWrapper>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 flex-wrap gap-2">
        <p className="text-sm text-gray-500">
          Page {currentPage} of {totalPages || 1}
        </p>

        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 cursor-pointer py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1 ? "bg-black text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 cursor-pointer py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

const FragmentWrapper = ({ children }: any) => <>{children}</>;
