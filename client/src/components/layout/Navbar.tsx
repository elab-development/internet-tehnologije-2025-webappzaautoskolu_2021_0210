import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  const role = user?.role;

  return (
    <div className="bg-slate-800 border-b border-slate-700 text-white">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Left */}
        <div className="font-bold text-lg">Autoškola</div>

        {/* Right */}
        <div className="flex gap-4 items-center text-slate-200">
          {/* SVI ULOGOVANI */}
          <Link className="hover:text-white" to="/dashboard">
            Dashboard
          </Link>

          {/* ADMIN + INSTRUCTOR */}
          {(role === "admin" || role === "instructor") && (
            <Link className="hover:text-white" to="/candidates">
              Candidates
            </Link>
          )}

          {/* KANDIDAT (primer za kasnije rute) */}
          {role === "candidate" && (
            <Link className="hover:text-white" to="/my-lessons">
              My lessons
            </Link>
          )}

          <button
            onClick={onLogout}
            className="bg-slate-900 border border-slate-700 px-3 py-1 rounded hover:bg-slate-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
