import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="bg-slate-800 border-b border-slate-700 text-white">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="font-bold">Autoškola</div>

        <div className="flex gap-4 items-center text-slate-200">
          <Link className="hover:text-white" to="/dashboard">
            Dashboard
          </Link>
          <Link className="hover:text-white" to="/candidates">
            Candidates
          </Link>

          <button
            onClick={logout}
            className="bg-slate-900 border border-slate-700 px-3 py-1 rounded hover:bg-slate-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
