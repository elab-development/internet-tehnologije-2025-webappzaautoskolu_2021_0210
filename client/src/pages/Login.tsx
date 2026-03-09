import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginRequest } from '../api/auth';
import { useAuth } from '../context/AuthContext';

import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function Login() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await loginRequest(email, password);

      if (!data.user?.id) {
        throw new Error('Neispravan odgovor servera: user profil nedostaje.');
      }

      setAuth(data.token, {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
      });

      const role = (data.user.role || '').toLowerCase();

      if (role === 'candidate') navigate('/kandidat');
      else if (role === 'admin') navigate('/instructors');
      else if (role === 'instructor') navigate('/zahtevi');
      else navigate('/login');
    } catch (err: unknown) {
      if (typeof err === 'object' && err && 'response' in err) {
        const maybeAxiosErr = err as {
          response?: { data?: { message?: string; error?: string } };
          message?: string;
        };

        const msg =
          maybeAxiosErr.response?.data?.message ||
          maybeAxiosErr.response?.data?.error ||
          maybeAxiosErr.message ||
          'Prijava nije uspela';

        setError(msg);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Prijava nije uspela');
      }
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
              placeholder="********"
            />

            {error && (
              <div className="text-sm text-red-300 bg-red-950/30 border border-red-900/60 rounded p-2">
                {error}
              </div>
            )}

            <div className="pt-1 space-y-2">
              <Button type="submit" disabled={loading} variant="primary">
                {loading ? 'Prijavljivanje...' : 'Prijavi se'}
              </Button>

              <div className="flex items-center justify-between text-sm text-slate-300">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="hover:text-white"
                >
                  Pocetna
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="hover:text-white"
                >
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
