export interface UserInfo {
  name: string;
  email: string;
  createdAt: Date;
}

export interface Teacher {
  role: "teacher" | "common";
  grade: string;
  group: string;
  name: string;
  attendance?: string;
}

export interface Student {
  grade: string;
  group: string;
  name: string;
  teacher: string;
  attendance?: string;
}
