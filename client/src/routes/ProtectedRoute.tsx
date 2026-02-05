import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { token } = useAuth();

  // fallback ako refreshuješ stranicu: token iz localStorage
  const stored = localStorage.getItem("token");
  const isAuthed = Boolean(token || stored);

  if (!isAuthed) return <Navigate to="/login" replace />;

  return <Outlet />;
}
