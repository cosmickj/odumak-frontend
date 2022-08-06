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
  // role: 'teacher' | 'common';
  role: string;
}

export interface Option {
  label: string;
  value: string;
}

export interface State {
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

export type Position = 'student' | 'teacher';
