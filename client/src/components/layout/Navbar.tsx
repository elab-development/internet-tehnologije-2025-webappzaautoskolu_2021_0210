import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function NavLink({
  to,
  label,
}: {
  to: string;
  label: string;
}) {
  const { pathname } = useLocation();
  const active = pathname === to;

  return (
    <Link
      to={to}
      className={
        "px-3 py-1 rounded border " +
        (active
          ? "text-white bg-slate-900 border-slate-600"
          : "text-slate-200 border-transparent hover:text-white hover:bg-slate-700")
      }
    >
      {label}
    </Link>
  );
}

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
        <div className="flex gap-2 items-center">
          {/* ADMIN */}
          {role === "admin" && (
            <>
              <NavLink to="/dashboard" label="Početna" />
              <NavLink to="/candidates" label="Kandidati" />
            </>
          )}

          {/* INSTRUCTOR */}
          {role === "instructor" && (
            <>
              <NavLink to="/dashboard" label="Početna" />
              <NavLink to="/candidates" label="Kandidati" />
              <NavLink to="/zahtevi" label="Zahtevi" />
            </>
          )}

          {/* CANDIDATE */}
          {role === "candidate" && (
            <>
              <NavLink to="/kandidat" label="Početna" />
              <NavLink to="/moji-casovi" label="Moji časovi" />
              <NavLink to="/zakazivanje-voznje" label="Zakazivanje" />
              <NavLink to="/moji-zahtevi" label="Moji zahtevi" />
              <NavLink to="/testovi" label="Testovi" />
              <NavLink to="/moji-rezultati" label="Rezultati" />
            </>
          )}

          {/* Logout */}
          <button
            onClick={onLogout}
            className="ml-2 bg-slate-900 border border-slate-700 px-3 py-1 rounded hover:bg-slate-700"
          >
            Odjava
          </button>
        </div>
      </div>
    </div>
  );
}
