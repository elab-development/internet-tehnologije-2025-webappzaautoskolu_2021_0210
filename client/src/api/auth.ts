import { api } from "./axios";

export type LoginResponse = {
  token: string;
  user?: {
    id?: string;
    name?: string;
    email?: string;
    role?: "admin" | "instructor" | "candidate";
  };
};

export async function login(email: string, password: string) {
  const res = await api.post<LoginResponse>("/api/auth/login", { email, password });
  return res.data;
}
