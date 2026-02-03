export type Role = "admin" | "instructor" | "candidate";

export type User = {
  _id: string;
  name: string;
  email: string;
  role: Role;
};

export type Candidate = {
  _id: string;
  user: User; 
  instructor?: string | null; 
  totalLessons: number;
};

