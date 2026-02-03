import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Candidates from "./pages/Candidates";
import ProtectedRoute from "./routes/ProtectedRoute";
import Navbar from "./components/layout/Navbar";
import { Outlet } from "react-router-dom";
import RoleRoute from "./routes/RoleRoute";

function ProtectedLayout() {
  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      <div className="max-w-5xl mx-auto">
        <Outlet />
      </div>
    </div>
  );
}
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
  <Route element={<ProtectedLayout />}>
    <Route path="/dashboard" element={<Dashboard />} />

    {/* admin + instructor */}
    <Route element={<RoleRoute allow={["admin", "instructor"]} />}>
      <Route path="/candidates" element={<Candidates />} />
      {/* kasnije: /lessons */}
    </Route>

    {/* candidate-only rute (kasnije) */}
    {/* <Route element={<RoleRoute allow={["candidate"]} />}>
        <Route path="/my-lessons" element={<MyLessons />} />
      </Route> */}
  </Route>
</Route>


        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
