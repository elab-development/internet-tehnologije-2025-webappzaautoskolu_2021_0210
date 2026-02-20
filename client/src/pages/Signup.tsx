import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios";

import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

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
        role: "candidate",
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
      <div className="w-full max-w-md">
        <Card title="Sign up">
          <p className="text-slate-300 text-sm mb-4">
            Kreiraj kandidat nalog za SmartDrive.
          </p>

          <form onSubmit={onSubmit} className="space-y-3">
            <Input
              label="Ime i prezime"
              value={name}
              onChange={setName}
              placeholder="npr. Milica Jovanović"
            />

            <Input
              label="Email"
              value={email}
              onChange={setEmail}
              type="email"
              placeholder="npr. milica@test.com"
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

            {ok && (
              <div className="text-sm text-green-300 bg-green-950/30 border border-green-900/60 rounded p-2">
                {ok}
              </div>
            )}

            <div className="pt-1 space-y-2">
              <Button type="submit" disabled={loading} variant="primary">
                {loading ? "Kreiram..." : "Kreiraj nalog"}
              </Button>

              <Button type="button" variant="secondary" onClick={() => navigate("/")}>
                Nazad na početnu
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}