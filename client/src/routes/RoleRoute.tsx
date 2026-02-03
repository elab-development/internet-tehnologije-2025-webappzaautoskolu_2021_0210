import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Role = "admin" | "instructor" | "candidate";

export default function RoleRoute({ allow }: { allow: Role[] }) {
  const { user } = useAuth();
  const role = user?.role;

  if (!role) return <Navigate to="/dashboard" replace />;
  if (!allow.includes(role)) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}
