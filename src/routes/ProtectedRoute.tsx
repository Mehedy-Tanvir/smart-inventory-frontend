import { useEffect, useState, type JSX } from "react";
import { Navigate } from "react-router-dom";
import instance from "../services/api";
import Loader from "../components/Loader";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: string[]; // optional array of allowed roles
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const [auth, setAuth] = useState<{ valid: boolean; role?: string } | null>(
    null,
  );
  const token = localStorage.getItem("token");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setAuth({ valid: false });
        return;
      }

      try {
        const res = await instance.get("/auth/verify-token", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAuth({ valid: true, role: res.data.user.role });
      } catch {
        setAuth({ valid: false });
        localStorage.removeItem("token");
      }
    };

    verify();
  }, [token]);

  if (auth === null) return <Loader />;

  if (!auth.valid) return <Navigate to="/login" replace />;

  // Check role if allowedRoles is set
  if (allowedRoles && !allowedRoles.includes(auth.role!)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
