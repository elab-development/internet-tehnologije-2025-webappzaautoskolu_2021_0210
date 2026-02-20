import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Role = "admin" | "instructor" | "candidate";

export type AuthUser = {
  email?: string;
  name?: string;
  id: string;
  role?: Role;
};

//sta ce kontekst da sadrzi
type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  setAuth: (token: string, user: AuthUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined); //kreiranje konteksta (global storage za React)

const AUTH_TOKEN_KEY = "token";
const AUTH_USER_KEY = "user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  //useState - cuva stanje, memoriju dok je stranica otvorena
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);


  //useEffect - pokrece se samo jednom kad se aplikacija ucita
  useEffect(() => {
    const t = localStorage.getItem(AUTH_TOKEN_KEY); //localStorage pamti posle refresh-a
    const u = localStorage.getItem(AUTH_USER_KEY);

    if (t) setToken(t);

    if (u) {
      try {
        const parsed = JSON.parse(u) as AuthUser;
        if (parsed && typeof parsed.id === "string") setUser(parsed);
        else localStorage.removeItem(AUTH_USER_KEY);
      } catch {
        localStorage.removeItem(AUTH_USER_KEY);
      }
    }
  }, []);


  //snimi login    
  const setAuth = (newToken: string, newUser: AuthUser) => {
    localStorage.setItem(AUTH_TOKEN_KEY, newToken);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    setToken(null);
    setUser(null);
  };

  //useMemo - sprecava nepotrebne rerendere
  const value = useMemo(() => ({ token, user, setAuth, logout }), [token, user]);

  //daje podatke svim komponentama
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
