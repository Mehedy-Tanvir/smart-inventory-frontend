import { useEffect, useState, type JSX } from "react";
import { Navigate } from "react-router-dom";
import instance from "../services/api";
import Loader from "../components/Loader";

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setIsValid(false);
        return;
      }

      try {
        const res = await instance.get("/auth/verify-token", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.valid) {
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      } catch {
        setIsValid(false);
        localStorage.removeItem("token");
      }
    };

    verify();
  }, [token]);

  if (isValid === null) {
    return <Loader />;
  }

  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
