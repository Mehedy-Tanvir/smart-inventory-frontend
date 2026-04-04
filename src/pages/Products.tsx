import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useCategories } from "../features/category/useCategories";
import { useProducts } from "../features/product/useProducts";

export default function Products() {
  const { categories, createCategory } = useCategories();
  const { products, createProduct } = useProducts();

  const [categoryName, setCategoryName] = useState("");
  const [productForm, setProductForm] = useState({
    name: "",
    categoryId: "",
    price: "",
    stock: "",
    minStock: "",
  });

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // FILTER
  const filteredProducts = products.filter((p: any) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory
      ? p.categoryId === selectedCategory
      : true;

    const matchesStatus = statusFilter
      ? statusFilter === "out"
        ? p.status === "Out of Stock"
        : p.status !== "Out of Stock"
      : true;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // PAGINATION
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // ✅ FIX: reset page if it becomes invalid after filtering
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [filteredProducts.length, totalPages, currentPage]);

  // HANDLERS
  const handleCreateCategory = async () => {
    if (!categoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      await createCategory(categoryName);
      toast.success(`Category "${categoryName}" created`);
      setCategoryName("");
    } catch {
      toast.error("Failed to create category");
    }
  };

  const handleCreateProduct = async () => {
    if (!productForm.name) return toast.error("Product name is required");
    if (!productForm.categoryId) return toast.error("Please select a category");
    if (!productForm.price) return toast.error("Price is required");

    try {
      await createProduct({
        name: productForm.name,
        categoryId: productForm.categoryId,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        minStockThreshold: Number(productForm.minStock),
      });

      toast.success(`"${productForm.name}" added`);

      setProductForm({
        name: "",
        categoryId: "",
        price: "",
        stock: "",
        minStock: "",
      });
    } catch {
      toast.error("Failed to create product");
    }
  };

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-10 py-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Products & Categories
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your inventory easily
        </p>
      </div>

      {/* Forms */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Category */}
        <div className="bg-white rounded-2xl border shadow-sm p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Create Category
            </h2>

            <div className="mt-5 space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Category Name
              </label>
              <input
                className="w-full mt-2 rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-black outline-none"
                placeholder="e.g. Electronics"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={handleCreateCategory}
            className="mt-6 w-full cursor-pointer bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
          >
            Add Category
          </button>
        </div>

        {/* Product */}
        <div className="xl:col-span-2 bg-white rounded-2xl border shadow-sm p-5">
          <h2 className="text-lg font-semibold text-gray-800">Add Product</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <input
              className="input-modern"
              placeholder="Product Name"
              value={productForm.name}
              onChange={(e) =>
                setProductForm({ ...productForm, name: e.target.value })
              }
            />

            <select
              className="input-modern"
              value={productForm.categoryId}
              onChange={(e) =>
                setProductForm({
                  ...productForm,
                  categoryId: e.target.value,
                })
              }
            >
              <option value="">Select Category</option>
              {categories.map((cat: any) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              className="input-modern cursor-pointer"
              placeholder="Price"
              value={productForm.price}
              onChange={(e) =>
                setProductForm({ ...productForm, price: e.target.value })
              }
            />

            <input
              type="number"
              className="input-modern"
              placeholder="Stock"
              value={productForm.stock}
              onChange={(e) =>
                setProductForm({ ...productForm, stock: e.target.value })
              }
            />

            <input
              type="number"
              className="input-modern sm:col-span-2"
              placeholder="Minimum Stock Threshold"
              value={productForm.minStock}
              onChange={(e) =>
                setProductForm({ ...productForm, minStock: e.target.value })
              }
            />
          </div>

          <button
            onClick={handleCreateProduct}
            className="mt-5 cursor-pointer bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
          >
            Create Product
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border shadow-sm flex flex-col md:flex-row gap-3">
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="input-modern w-full md:w-1/3"
        />

        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1);
          }}
          className="input-modern"
        >
          <option value="">All Categories</option>
          {categories.map((cat: any) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="input-modern"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="out">Out of Stock</option>
        </select>
      </div>

      {/* Product List */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b font-semibold">
          Products ({filteredProducts.length})
        </div>

        {/* Desktop */}
        <div className="hidden md:block">
          {paginatedProducts.length > 0 ? (
            <table className="w-full text-sm">
              <tbody>
                {paginatedProducts.map((p: any) => (
                  <tr key={p._id} className="border-t">
                    <td className="px-5 py-3">{p.name}</td>
                    <td className="px-5 py-3">{p.categoryName}</td>
                    <td className="px-5 py-3">${p.price}</td>
                    <td className="px-5 py-3">{p.stock}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          p.status === "Out of Stock"
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {p.status || "Active"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center py-6 text-gray-400">
              No products match your filters
            </p>
          )}
        </div>

        {/* ✅ FIXED MOBILE */}
        <div className="md:hidden divide-y">
          {paginatedProducts.length > 0 ? (
            paginatedProducts.map((p: any) => (
              <div key={p._id} className="p-4 space-y-2">
                <div className="flex justify-between">
                  <h3 className="font-medium">{p.name}</h3>
                  <span>${p.price}</span>
                </div>

                <p className="text-xs text-gray-500">
                  {p.categoryName || "No category"}
                </p>

                <div className="flex justify-between">
                  <span>Stock: {p.stock}</span>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      p.status === "Out of Stock"
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {p.status || "Active"}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-6 text-gray-400">
              No products match your filters
            </p>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-4 py-4 border-t">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span>
            {currentPage} / {totalPages || 1}
          </span>

          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
