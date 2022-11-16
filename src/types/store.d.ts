import type { MemberPosition, TeacherRole, UserInfo } from './index';

/** account.ts */
export interface AccountData {
  grade: string;
  group: string;
  role: TeacherRole;
  church: string;
  department: string;
  createdAt: {
    nanoseconds: number;
    seconds: number;
  };
}

export interface UserData extends AccountData {
  uid: string;
  email: string;
  name: string;
}

export interface AccountCreateUserParams {
  uid: string;
  church: string;
  department: string;
  role: TeacherRole;
  grade: string;
  group: string;
}

export interface AccountFetchUserParams {
  uid: string;
}

export interface AccountSignupParams {
  email: string;
  password: string;
  name: string;
}

export interface AccountLoginParams {
  email: string;
  password: string;
}

// attendace.ts
export interface StudentsAttendance {
  date: Date;
  grade: string;
  group: string;
  teacher: string;
  studentsAttendance: Student[];
}

export interface TeachersAttendance {
  date: Date;
  teachersAttendance: Teacher[];
}

/** member.ts */
export interface Members {
  church: string;
  department: string;
  members: Teacher[] | Student[];
  position: MemberPosition;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}

export interface MembersFetchAllParmas
  extends Pick<UserInfo, 'church' | 'department'> {
  position: MemberPosition;
}
