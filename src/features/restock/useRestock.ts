import { useQuery } from "@tanstack/react-query";
import axios from "../../services/api";

export const useRestock = () => {
  return useQuery({
    queryKey: ["restock"],
    queryFn: async () => {
      const res = await axios.get("/restock");
      return res.data;
    },
  });
};
