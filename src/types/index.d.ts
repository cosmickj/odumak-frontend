export interface UserInfo {
  name: string;
  email: string;
  createdAt: Date;
}

export interface Student {
  grade: string;
  group: string;
  teacher?: string;
  name: string;
  gender?: string;
  birth?: string;
  phone?: string;
  address?: string;
  remark?: string;
  attendance?: string;
}
export interface Teacher {
  attendance?: string;
  grade: string;
  group: string;
  name: string;
  role: TeacherRole;
}

export interface Option {
  label: string;
  value: string;
}

export interface AddStudentParams {
  index?: number | null;
  grade: string | null;
  group: string | null;
  name: string;
  gender: string | null;
  birth: Date | null;
  phone: string;
  teacher: string;
  address: string;
  remark: string;
}

export interface AddTeacherParams {
  index?: number | null;
  grade: string | null;
  group: string | null;
  name: string;
  role: string | null;
  remark: string;
}

export type TeacherRole = 'admin' | 'main' | 'sub' | 'common';

export type MemberPosition = 'student' | 'teacher';
