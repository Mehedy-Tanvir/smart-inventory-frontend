import { useEffect, useState } from "react";
import instance from "../../services/api";

export const useProducts = () => {
  const [products, setProducts] = useState<any[]>([]);

  const normalizeData = (resData: any) => {
    // Handles multiple backend response formats safely
    if (Array.isArray(resData)) return resData;
    if (Array.isArray(resData?.data)) return resData.data;
    if (Array.isArray(resData?.data?.data)) return resData.data.data;
    return [];
  };

  const fetchProducts = async () => {
    try {
      const res = await instance.get("/products");
      setProducts(normalizeData(res.data));
    } catch (error) {
      console.error("Fetch products error:", error);
      setProducts([]); // prevent crash
    }
  };

  const createProduct = async (data: any) => {
    try {
      await instance.post("/products", data);
      fetchProducts();
    } catch (error) {
      console.error("Create product error:", error);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchProducts();
    })();
  }, []);

  return { products, createProduct };
};
