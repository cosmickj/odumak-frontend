export type TeacherRole = 'admin' | 'main' | 'sub' | 'common';

export interface UserInfo {
  church: string;
  createdAt: Date;
  email: string;
  grade: string;
  group: string;
  name: string;
  role: TeacherRole;
}

export type MemberPosition = 'student' | 'teacher';

export interface Member {
  church: string;
  createdAt: Date;
  department: string;
  members: Student | Teacher;
  position: MemberPosition;
  updatedAt: Date;
}

export interface Student {
  address?: string;
  attendance?: string;
  birth?: string;
  gender: string;
  grade: string;
  group: string;
  name: string;
  phone?: string;
  registeredAt?: Date;
  remark?: string;
  teacher: string;
}

export interface Teacher {
  attendance?: string;
  grade: string;
  group: string;
  name: string;
  registeredAt?: Date;
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
