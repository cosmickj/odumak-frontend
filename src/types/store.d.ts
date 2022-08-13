import type { MemberPosition, TeacherRole } from '.';

// account.ts
export interface AccountData {
  grade: string;
  group: string;
  role: TeacherRole;
  church?: string;
  department?: string;
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

// member.ts
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
