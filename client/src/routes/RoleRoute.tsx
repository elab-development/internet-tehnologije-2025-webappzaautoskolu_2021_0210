import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Props = {
  allow: string[];
};

export default function RoleRoute({ allow }: Props) {
  const { user, token } = useAuth();

  const stored = localStorage.getItem("token");
  const hasToken = Boolean(token || stored);

  // nema token ide login
  if (!hasToken) return <Navigate to="/login" replace />;

  // user još nije učitan  pusti (ne blokiraj)
  if (!user) return <Outlet />;

  //  TypeScript SAFE varijanta
  const role = user.role ?? "";

  if (!allow.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
