import { api } from "./axios";

export type Lesson = {
  _id: string;
  date: string;
  duration: number;
  status: "scheduled" | "completed" | "cancelled";
  candidate?: any;
  instructor?: any;
};

export async function getLessons() {
  const res = await api.get<Lesson[]>("/api/lessons");
  return res.data;
}
