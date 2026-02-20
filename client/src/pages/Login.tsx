import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginRequest } from "../api/auth";
import { useAuth } from "../context/AuthContext";

import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

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
      if (role === "candidate") navigate("/kandidat");
      else navigate("/dashboard");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Prijava nije uspela";

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card title="Log in">
         

          <form onSubmit={onSubmit} className="space-y-3">
            <Input
              label="Email"
              value={email}
              onChange={setEmail}
              type="email"
              placeholder="npr. test@test.com"
            />

            <Input
              label="Lozinka"
              value={password}
              onChange={setPassword}
              type="password"
              placeholder="••••••••"
            />

            {error && (
              <div className="text-sm text-red-300 bg-red-950/30 border border-red-900/60 rounded p-2">
                {error}
              </div>
            )}

            <div className="pt-1 space-y-2">
              <Button type="submit" disabled={loading} variant="primary">
                {loading ? "Prijavljivanje..." : "Prijavi se"}
              </Button>

              <div className="flex items-center justify-between text-sm text-slate-300">
                <button type="button" onClick={() => navigate("/")} className="hover:text-white">
                  ← Početna
                </button>

                <button type="button" onClick={() => navigate("/signup")} className="hover:text-white">
                  Nemam nalog
                </button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}