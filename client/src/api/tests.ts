import { api } from "./axios";

export type TestSummary = {
  _id: string;
  title: string;
  description: string;
  questionCount: number;
};

export type TestQuestion = {
  index: number;
  text: string;
  options: string[];
};

export type TestDetails = {
  _id: string;
  title: string;
  description: string;
  questions: TestQuestion[];
};

export type SubmittedTestResult = {
  _id: string;
  testId: string;
  score: number;
  maxScore: number;
  percentage: number;
  createdAt: string;
};

export type CandidateTestResult = {
  _id: string;
  score: number;
  maxScore: number;
  percentage: number;
  createdAt: string;
  test: {
    _id: string;
    title: string;
  };
};

export type AdminTestSummary = {
  _id: string;
  title: string;
  description: string;
  questionCount: number;
  isActive: boolean;
  createdAt: string;
};

export type CreateTestPayload = {
  title: string;
  description: string;
  questions: Array<{
    text: string;
    options: string[];
    correctOption: number;
  }>;
};

export async function getAvailableTests() {
  const res = await api.get<TestSummary[]>("/api/tests");
  return res.data;
}

export async function getTestById(id: string) {
  const res = await api.get<TestDetails>(`/api/tests/${id}`);
  return res.data;
}

export async function submitTest(testId: string, answers: number[]) {
  const res = await api.post<SubmittedTestResult>("/api/tests/submit", {
    testId,
    answers,
  });
  return res.data;
}

export async function getMyTestResults() {
  const res = await api.get<CandidateTestResult[]>("/api/tests/results/me");
  return res.data;
}

export async function getAllTestsAdmin() {
  const res = await api.get<AdminTestSummary[]>("/api/tests/admin/all");
  return res.data;
}

export async function createTestAdmin(payload: CreateTestPayload) {
  const res = await api.post<AdminTestSummary>("/api/tests/admin", payload);
  return res.data;
}

export async function updateTestStatusAdmin(id: string, isActive: boolean) {
  const res = await api.put<{ _id: string; title: string; isActive: boolean }>(
    `/api/tests/admin/${id}/status`,
    { isActive }
  );
  return res.data;
}

export async function deleteTestAdmin(id: string) {
  const res = await api.delete<{ message: string }>(`/api/tests/admin/${id}`);
  return res.data;
}

export async function cleanupInvalidTestsAdmin() {
  const res = await api.delete<{ deletedTests: number; deletedResults: number }>(
    "/api/tests/admin/cleanup/invalid"
  );
  return res.data;
}
