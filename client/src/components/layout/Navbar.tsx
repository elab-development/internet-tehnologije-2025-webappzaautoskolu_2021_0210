import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const role = user?.role;

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="bg-slate-800 border-b border-slate-700 text-white">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="font-bold text-lg">Auto-škola</div>

        {/* Meni */}
        <div className="flex gap-4 items-center text-slate-200">
          {/* ADMIN + INSTRUCTOR */}
          {(role === "admin" || role === "instructor") && (
            <>
              <Link className="hover:text-white" to="/dashboard">
                Početna
              </Link>

              <Link className="hover:text-white" to="/candidates">
                Kandidati
              </Link>
            </>
          )}

          {/* CANDIDATE */}
          {role === "candidate" && (
            <>
              <Link className="hover:text-white" to="/kandidat">
                Početna
              </Link>

              <Link className="hover:text-white" to="/moji-casovi">
                Moji časovi
              </Link>

              <Link className="hover:text-white" to="/testovi">
                Testovi
              </Link>

              <Link className="hover:text-white" to="/zakazivanje-voznje">
                Zakazivanje vožnje
              </Link>

              <Link className="hover:text-white" to="/moji-rezultati">
                Rezultati
              </Link>
            </>
          )}

          {/* Logout */}
          <button
            onClick={onLogout}
            className="bg-slate-900 border border-slate-700 px-3 py-1 rounded hover:bg-slate-700"
          >
            Odjava
          </button>
        </div>
      </div>
    </div>
  );
}
