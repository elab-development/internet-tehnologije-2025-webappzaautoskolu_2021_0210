import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginRequest } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await loginRequest(email, password);

      setAuth(data.token, data.user);

      const role = data.user?.role;

      if (role === "candidate") {
        navigate("/kandidat");
      } else {
        // admin ili instructor
        navigate("/dashboard");
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Neuspešna prijava";

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-800 rounded-xl p-6 shadow space-y-4">
        <h1 className="text-2xl font-bold">Prijava</h1>

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Email adresa</label>
            <input
              className="w-full rounded bg-slate-900 border border-slate-700 p-2 outline-none focus:border-slate-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="npr. test@mail.com"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Lozinka</label>
            <input
              className="w-full rounded bg-slate-900 border border-slate-700 p-2 outline-none focus:border-slate-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div className="text-sm text-red-400 bg-red-950/30 border border-red-900/60 rounded p-2">
              Greška: {error}
            </div>
          )}

          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:hover:bg-blue-600 rounded p-2 font-semibold"
          >
            {loading ? "Prijavljivanje..." : "Prijavi se"}
          </button>
        </form>

        <p className="text-xs text-slate-400">
          Prijava radi preko backend-a:{" "}
          <span className="text-slate-300">/api/auth/login</span>
        </p>
      </div>
    </div>
  );
}
