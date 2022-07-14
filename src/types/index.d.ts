export interface UserInfo {
  name: string;
  email: string;
  createdAt: Date;
}

export interface Student {
  attendance?: string;
  grade: string;
  group: string;
  name: string;
  teacher: string;
}
export interface Teacher {
  attendance?: string;
  grade: string;
  group: string;
  name: string;
  // role: 'teacher' | 'common';
  role: string;
}
