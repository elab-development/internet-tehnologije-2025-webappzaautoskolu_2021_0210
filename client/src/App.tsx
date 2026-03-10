import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

import Login from "./pages/Login";
import Candidates from "./pages/Candidates";
import Instructors from "./pages/Instructors";

import CandidateHome from "./pages/CandidateHome";
import Booking from "./pages/Booking";
import MyLessons from "./pages/MyLessons";
import MyRequests from "./pages/MyRequests";
import InstructorRequests from "./pages/InstructorRequests";
import InstructorCalendar from "./pages/InstructorCalendar";
import CandidateTests from "./pages/CandidateTests";
import AdminTests from "./pages/AdminTests";

import Navbar from "./components/layout/Navbar";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";

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
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<ProtectedLayout />}>
            <Route element={<RoleRoute allow={["admin", "instructor"]} />}>
              <Route path="/candidates" element={<Candidates />} />
            </Route>

            <Route element={<RoleRoute allow={["admin"]} />}>
              <Route path="/instructors" element={<Instructors />} />
              <Route path="/testovi-admin" element={<AdminTests />} />
            </Route>

            <Route element={<RoleRoute allow={["instructor"]} />}>
              <Route path="/zahtevi" element={<InstructorRequests />} />
              <Route path="/instruktor-kalendar" element={<InstructorCalendar />} />
            </Route>

            <Route element={<RoleRoute allow={["candidate"]} />}>
              <Route path="/kandidat" element={<CandidateHome />} />
              <Route path="/moji-casovi" element={<MyLessons />} />
              <Route path="/zakazivanje-voznje" element={<Booking />} />
              <Route path="/moji-zahtevi" element={<MyRequests />} />
              <Route path="/testovi" element={<CandidateTests />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
