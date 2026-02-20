import { api } from "./axios";

export async function getInstructors() {
  const res = await api.get("/api/instructors");
  return res.data;
}

export async function deleteInstructor(id: string) {
  const res = await api.delete(`/api/instructors/${id}`);
  return res.data;
}