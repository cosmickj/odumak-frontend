export type SubmitType = '추가하기' | '수정하기';
export type Gender = 'male' | 'female';
export type MemberPosition = 'student' | 'teacher';
export type TeacherRole = 'admin' | 'main' | 'sub' | 'common';

export interface UserInfo {
  church: string;
  createdAt: Date;
  department: string;
  email: string;
  grade: string;
  group: string;
  name: string;
  role: TeacherRole;
}

export interface Member {
  church: string;
  createdAt: Date;
  department: string;
  members: Student | Teacher;
  position: MemberPosition;
  updatedAt: Date;
}

export interface Student {
  uid?: string;
  address: string;
  birth: Date;
  gender: Gender;
  grade: string;
  group: string;
  name: string;
  phone: string;
  registeredAt: Date;
  remark: string;
}

export interface Teacher {
  _id: string;
  grade: string;
  group: string;
  name: string;
  role: TeacherRole;
  birth: Date;
  gender: Gender;
  phone: string;
  registeredAt: Date;
  remark: string;
}

export interface Option {
  label: string;
  value: string;
}

export interface CustomColumn {
  field: string;
  header: string;
  sortable: boolean;
  format: undefined | Function;
}
