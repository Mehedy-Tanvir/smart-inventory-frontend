import { useQuery } from "@tanstack/react-query";
import axios from "../../services/api";

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axios.get("/products");
      return res.data;
    },
  });
};
