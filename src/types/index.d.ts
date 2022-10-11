export type TeacherRole = 'admin' | 'main' | 'sub' | 'common';
export type MemberPosition = 'student' | 'teacher';

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

export interface Student {
  _id: string;
  address: string;
  birth: Date;
  gender: string;
  grade: string;
  group: string;
  name: string;
  phone: string;
  phoneOwner: string;
  registeredAt: Date;
  remark: string;
  teacher: string;
}

export interface Teacher {
  _id: string;
  birth: Date;
  gender: string;
  grade: string;
  group: string;
  name: string;
  role: TeacherRole;
  remark: string;
  registeredAt: Date;
}

export interface Member {
  church: string;
  createdAt: Date;
  department: string;
  members: Student | Teacher;
  position: MemberPosition;
  updatedAt: Date;
}

export interface Option {
  label: string;
  value: string;
}

// export interface AddStudentParams {
//   index?: number | null;
//   grade: string | null;
//   group: string | null;
//   name: string;
//   gender: string | null;
//   birth: Date | null;
//   phone: string;
//   teacher: string;
//   address: string;
//   remark: string;
// }

// export interface AddTeacherParams {
//   index?: number | null;
//   grade: string | null;
//   group: string | null;
//   name: string;
//   role: string | null;
//   remark: string;
// }

export type SubmitType = 'ADD' | 'EDIT';
