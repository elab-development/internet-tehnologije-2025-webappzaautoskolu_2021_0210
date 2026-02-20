import { api } from "./axios";

export async function getCandidates() {
  const res = await api.get("/api/candidates");
  return res.data;
}

export async function deleteCandidate(id: string) {
  await api.delete(`/api/candidates/${id}`);
}

// candidate - moj profil (za booking)
export type MyCandidate = {
  _id: string;
  instructor?: { _id: string };
};

export async function getMyCandidate() {
  const res = await api.get<MyCandidate>("/api/candidates/me");
  return res.data;
}
