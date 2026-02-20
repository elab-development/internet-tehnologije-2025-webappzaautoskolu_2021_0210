import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Candidates from "./pages/Candidates";

import CandidateHome from "./pages/CandidateHome";
import Booking from "./pages/Booking";
import MyLessons from "./pages/MyLessons";


import MyRequests from "./pages/MyRequests";
import InstructorRequests from "./pages/InstructorRequests";

import Navbar from "./components/layout/Navbar";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Instructors from "./pages/Instructors";

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
        <Route path="/" element={<Landing />} />
<Route path="/signup" element={<Signup />} />


        {/* public */}
        <Route path="/login" element={<Login />} />

        {/* protected */}
        <Route element={<ProtectedRoute />}>
          <Route element={<ProtectedLayout />}>
            {/* zajedničko (svi ulogovani) */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* admin */}
            <Route element={<RoleRoute allow={["admin"]} />}>
              <Route path="/candidates" element={<Candidates />} />
              <Route path="/instructors" element={<Instructors />} />
            </Route>

            {/* instructor-only */}
            <Route element={<RoleRoute allow={["instructor"]} />}>
              <Route path="/zahtevi" element={<InstructorRequests />} />
              <Route path="/candidates" element={<Candidates />} />
            </Route>

            {/* candidate-only */}
            <Route element={<RoleRoute allow={["candidate"]} />}>
              <Route path="/kandidat" element={<CandidateHome />} />
 <Route path="/moji-casovi" element={<MyLessons />} />
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
