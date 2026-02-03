import { api } from "./axios";
import type { Candidate } from "../types/models";

export async function getCandidates() {
  const res = await api.get<Candidate[]>("/api/candidates");
  return res.data;
}

export type CreateCandidateInput = {
  userId: string;         
  instructorId?: string;   
  totalLessons?: number;   
};

export async function createCandidate(payload: CreateCandidateInput) {
  const res = await api.post<Candidate>("/api/candidates", payload);
  return res.data;
}

export async function deleteCandidate(id: string) {
  await api.delete(`/api/candidates/${id}`);
}
