import { useState } from "react";
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // adjust as needed
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleCreateCategory = async () => {
    if (!categoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      await createCategory(categoryName);
      toast.success(`Category "${categoryName}" created successfully`);
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
    <div className="space-y-6 px-3 sm:px-5 lg:px-8">
      {/* HEADER */}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Products & Categories
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Manage your inventory categories and products
        </p>
      </div>

      {/* FORMS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* CATEGORY FORM */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border">
          <h2 className="font-semibold text-gray-700 mb-3 text-sm sm:text-base">
            Create Category
          </h2>
          <input
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black outline-none"
            placeholder="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <button
            onClick={handleCreateCategory}
            className="mt-3 w-full bg-black text-white py-2 rounded-lg text-sm hover:bg-gray-800 transition"
          >
            Add Category
          </button>
        </div>

        {/* PRODUCT FORM */}
        <div className="lg:col-span-2 bg-white p-4 sm:p-5 rounded-2xl shadow-sm border">
          <h2 className="font-semibold text-gray-700 mb-4 text-sm sm:text-base">
            Add Product
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
                setProductForm({ ...productForm, categoryId: e.target.value })
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
              className="input-modern"
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
            className="mt-4 w-full sm:w-auto bg-black text-white px-5 py-2 rounded-lg text-sm hover:bg-gray-800 transition"
          >
            Create Product
          </button>
        </div>
      </div>

      {/* PRODUCT LIST */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="p-4 sm:p-5 border-b">
          <h2 className="font-semibold text-gray-700 text-sm sm:text-base">
            Product List
          </h2>
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-5 py-3 text-left">Product</th>
                <th className="px-5 py-3 text-left">Category</th>
                <th className="px-5 py-3 text-left">Price</th>
                <th className="px-5 py-3 text-left">Stock</th>
                <th className="px-5 py-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {paginatedProducts.map((p: any) => (
                <tr key={p._id} className="border-t hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium">{p.name}</td>
                  <td className="px-5 py-3">{p.categoryName || "N/A"}</td>
                  <td className="px-5 py-3">${p.price}</td>
                  <td className="px-5 py-3">{p.stock}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
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
        </div>

        {/* MOBILE CARDS */}
        <div className="md:hidden divide-y">
          {paginatedProducts.length > 0 ? (
            paginatedProducts.map((p: any) => (
              <div key={p._id} className="p-4 space-y-2">
                <div className="flex justify-between">
                  <h3 className="font-medium text-gray-800">{p.name}</h3>
                  <span className="text-sm font-semibold">${p.price}</span>
                </div>
                <p className="text-xs text-gray-500">
                  {p.categoryName || "No category"}
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span>Stock: {p.stock}</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
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
              No products available
            </p>
          )}
        </div>

        {/* PAGINATION CONTROLS */}
        <div className="flex justify-center items-center space-x-3 py-4 border-t">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
