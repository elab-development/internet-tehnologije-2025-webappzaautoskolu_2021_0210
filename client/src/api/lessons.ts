import { api } from "./axios";

export type LessonStatus = "scheduled" | "completed" | "cancelled";

export type Lesson = {
  _id: string;
  title?: string;
  date: string;
  duration: number;
  status: LessonStatus;

  candidate?: {
    _id: string;
    user?: { _id: string };
  };

  instructor?: {
    _id: string;
    user?: {
      name?: string;
    };
  };
};

export async function getLessons() {
  const res = await api.get<Lesson[]>("/api/lessons");
  return res.data;
}
