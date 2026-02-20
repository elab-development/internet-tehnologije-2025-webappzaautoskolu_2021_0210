import { api } from "./axios";

//pos backendu login info

export type LoginResponse = {
  token: string;
  user?: {
    id?: string;
    name?: string;
    email?: string;
    role?: "admin" | "instructor" | "candidate";
  };
};
//vrati jwt tokrn i user info

export async function login(email: string, password: string) {
  const res = await api.post<LoginResponse>("/api/auth/login", { email, password });
  return res.data;
}
