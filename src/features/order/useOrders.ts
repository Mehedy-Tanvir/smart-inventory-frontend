import { useQuery } from "@tanstack/react-query";
import axios from "../../services/api";

export const useOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await axios.get("/orders");
      return res.data;
    },
  });
};
