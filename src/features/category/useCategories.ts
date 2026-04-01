import { useEffect, useState } from "react";
import instance from "../../services/api";

export const useCategories = () => {
  const [categories, setCategories] = useState<any[]>([]);

  const normalizeData = (resData: any) => {
    if (Array.isArray(resData)) return resData;
    if (Array.isArray(resData?.data)) return resData.data;
    return [];
  };

  const fetchCategories = async () => {
    try {
      const res = await instance.get("/categories");
      setCategories(normalizeData(res.data));
    } catch (error) {
      console.error("Fetch categories error:", error);
      setCategories([]);
    }
  };

  const createCategory = async (name: string) => {
    try {
      await instance.post("/categories", { name });
      fetchCategories();
    } catch (error) {
      console.error("Create category error:", error);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchCategories();
    })();
  }, []);

  return { categories, createCategory };
};
