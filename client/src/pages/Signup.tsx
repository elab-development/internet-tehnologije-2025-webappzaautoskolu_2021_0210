import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setOk(null);
    setLoading(true);

    try {
      await api.post("/api/auth/register", {
        name,
        email,
        password,
        role: "candidate", // default: kandidat (možeš menjati kasnije)
      });

      setOk("Nalog je kreiran. Sada se prijavi.");
      setTimeout(() => navigate("/login"), 700);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Registracija nije uspela";

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow space-y-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Sign up</h1>
          <p className="text-slate-300 text-sm">
            Kreiraj kandidat nalog za SmartDrive.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Ime i prezime</label>
            <input
              className="w-full rounded bg-slate-950 border border-slate-700 p-2 outline-none focus:border-slate-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="npr. Milica Jovanović"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Email</label>
            <input
              className="w-full rounded bg-slate-950 border border-slate-700 p-2 outline-none focus:border-slate-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="npr. milica@test.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Lozinka</label>
            <input
              className="w-full rounded bg-slate-950 border border-slate-700 p-2 outline-none focus:border-slate-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="text-sm text-red-300 bg-red-950/30 border border-red-900/60 rounded p-2">
              {error}
            </div>
          )}

          {ok && (
            <div className="text-sm text-green-300 bg-green-950/30 border border-green-900/60 rounded p-2">
              {ok}
            </div>
          )}

          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 rounded p-2 font-semibold"
          >
            {loading ? "Kreiram..." : "Kreiraj nalog"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full border border-slate-700 hover:bg-slate-800 rounded p-2"
          >
            Nazad na početnu
          </button>
        </form>
      </div>
    </div>
  );
}
