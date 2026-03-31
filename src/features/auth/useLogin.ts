import { useMutation } from "@tanstack/react-query";
import axios from "../../services/api";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      axios.post("/auth/login", data),

    onSuccess: (res) => {
      localStorage.setItem("token", res.data.token);
      navigate("/");
    },
  });
};
