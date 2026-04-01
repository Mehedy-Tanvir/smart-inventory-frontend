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

  // ✅ CATEGORY
  const handleCreateCategory = async () => {
    if (!categoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      await createCategory(categoryName);
      toast.success(`Category "${categoryName}" created successfully`);
      setCategoryName("");
    } catch (err) {
      toast.error("Failed to create category");
    }
  };

  // ✅ PRODUCT
  const handleCreateProduct = async () => {
    if (!productForm.name) {
      toast.error("Product name is required");
      return;
    }

    if (!productForm.categoryId) {
      toast.error("Please select a category");
      return;
    }

    if (!productForm.price) {
      toast.error("Price is required");
      return;
    }

    try {
      await createProduct({
        name: productForm.name,
        categoryId: productForm.categoryId,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        minStockThreshold: Number(productForm.minStock),
      });

      toast.success(`"${productForm.name}" added to inventory`);

      setProductForm({
        name: "",
        categoryId: "",
        price: "",
        stock: "",
        minStock: "",
      });
    } catch (err) {
      toast.error("Failed to create product");
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Products & Categories
        </h1>
        <p className="text-sm text-gray-500">
          Manage your inventory categories and products
        </p>
      </div>

      {/* CATEGORY + PRODUCT FORM */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CATEGORY CARD */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border hover:shadow-md transition">
          <h2 className="font-semibold text-gray-700 mb-3">Create Category</h2>

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
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl shadow-sm border hover:shadow-md transition">
          <h2 className="font-semibold text-gray-700 mb-4">Add Product</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              placeholder="Stock Quantity"
              value={productForm.stock}
              onChange={(e) =>
                setProductForm({ ...productForm, stock: e.target.value })
              }
            />

            <input
              type="number"
              className="input-modern md:col-span-2"
              placeholder="Minimum Stock Threshold"
              value={productForm.minStock}
              onChange={(e) =>
                setProductForm({ ...productForm, minStock: e.target.value })
              }
            />
          </div>

          <button
            onClick={handleCreateProduct}
            className="mt-4 bg-black text-white px-5 py-2 rounded-lg text-sm hover:bg-gray-800 transition"
          >
            Create Product
          </button>
        </div>
      </div>

      {/* PRODUCT TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border hover:shadow-md transition overflow-hidden">
        <div className="p-5 border-b">
          <h2 className="font-semibold text-gray-700">Product List</h2>
        </div>

        <div className="overflow-x-auto">
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
              {products.length > 0 ? (
                products.map((p: any) => (
                  <tr
                    key={p._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-5 py-3 font-medium text-gray-800">
                      {p.name}
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {p.categoryName || "N/A"}
                    </td>
                    <td className="px-5 py-3">${p.price}</td>
                    <td className="px-5 py-3">{p.stock}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          p.status === "Out of Stock"
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {p.status || "Active"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400">
                    No products available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
