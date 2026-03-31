import { useMutation } from "@tanstack/react-query";
import api from "../../services/api";

interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export const useSignup = () => {
  return useMutation({
    mutationFn: async (data: SignupPayload) => {
      const res = await api.post("/auth/signup", data);
      return res.data;
    },

    onSuccess: (data) => {
      console.log("Signup success:", data);
    },

    onError: (error: any) => {
      console.error(error?.response?.data?.message || "Signup failed");
    },
  });
};
