import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Candidates from "./pages/Candidates";

import CandidateHome from "./pages/CandidateHome";
import MyLessons from "./pages/MyLessons";
import Tests from "./pages/Tests";
import Booking from "./pages/Booking";
import MyTestResults from "./pages/MyTestResults";

// NOVO
import MyRequests from "./pages/MyRequests";
import InstructorRequests from "./pages/InstructorRequests";

import Navbar from "./components/layout/Navbar";
import ProtectedRoute from "./routes/ProtectedRoute";
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
        {/* default */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* public */}
        <Route path="/login" element={<Login />} />

        {/* protected */}
        <Route element={<ProtectedRoute />}>
          <Route element={<ProtectedLayout />}>
            {/* zajedničko (svi ulogovani) */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* admin + instructor */}
            <Route element={<RoleRoute allow={["admin", "instructor"]} />}>
              <Route path="/candidates" element={<Candidates />} />
            </Route>

            {/* instructor-only */}
            <Route element={<RoleRoute allow={["instructor"]} />}>
              <Route path="/zahtevi" element={<InstructorRequests />} />
            </Route>

            {/* candidate-only */}
            <Route element={<RoleRoute allow={["candidate"]} />}>
              <Route path="/kandidat" element={<CandidateHome />} />
              <Route path="/moji-casovi" element={<MyLessons />} />
              <Route path="/testovi" element={<Tests />} />
              <Route path="/moji-rezultati" element={<MyTestResults />} />

              {/* NOVO: flow za zakazivanje */}
              <Route path="/zakazivanje-voznje" element={<Booking />} />
              <Route path="/moji-zahtevi" element={<MyRequests />} />
            </Route>
          </Route>
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
