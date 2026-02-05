import { api } from "./axios";

export type LessonRequestStatus = "pending" | "approved" | "rejected";

export type LessonRequest = {
  _id: string;
  requestedDate: string;
  duration: number;
  status: LessonRequestStatus;
  instructorTitle?: string;
  rejectionReason?: string;

  // za instructor listu (populate)
  candidate?: {
    _id: string;
    user?: { name: string; email: string };
  };
};

export async function createLessonRequest(payload: {
  requestedDate: string;
  duration?: number;
}) {
  const res = await api.post<LessonRequest>("/api/lesson-requests", payload);
  return res.data;
}

export async function getMyLessonRequests() {
  const res = await api.get<LessonRequest[]>("/api/lesson-requests/my");
  return res.data;
}

export async function getInstructorLessonRequests() {
  const res = await api.get<LessonRequest[]>("/api/lesson-requests/instructor");
  return res.data;
}

export async function approveLessonRequest(id: string, title: string) {
  const res = await api.patch(`/api/lesson-requests/${id}/approve`, { title });
  return res.data; // { request, lesson }
}

export async function rejectLessonRequest(id: string, reason: string) {
  const res = await api.patch(`/api/lesson-requests/${id}/reject`, { reason });
  return res.data;
}
