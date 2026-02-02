import { useEffect, useState } from "react";
import { api } from "./api/axios";

export default function App() {
  const [health, setHealth] = useState<string>("Učitavanje...");

  useEffect(() => {
    api
      .get("/api/health")
      .then((res) => {
        setHealth(JSON.stringify(res.data, null, 2));
      })
      .catch((err) => {
        setHealth("Greška: " + err.message);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
      <div className="bg-slate-800 rounded-xl p-6 w-full max-w-xl shadow space-y-4">
        <h1 className="text-2xl font-bold">Autoškola – Frontend</h1>

        <div>
          <p className="text-slate-300 mb-2">Backend health response:</p>
          <pre className="bg-slate-900 p-4 rounded text-sm overflow-auto">
            {health}
          </pre>
        </div>
      </div>
    </div>
  );
}
