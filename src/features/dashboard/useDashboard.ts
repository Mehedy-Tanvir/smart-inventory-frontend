import { useQuery } from "@tanstack/react-query";
import axios from "../../services/api";

export const useDashboard = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await axios.get("/dashboard");
      return res.data;
    },
  });
};
