import toast from "react-hot-toast";

export const logoutUser = () => {
  localStorage.removeItem("token");
  toast.success("Logged out successfully");
};
