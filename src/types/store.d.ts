import type {
  AttendanceState,
  MemberPosition,
  TeacherRole,
  UserInfo,
} from './index';

/** account.ts */
type K = 'uid' | 'email' | 'displayName';
export type AccountData = {
  -readonly [key in K]: User[key];
};

export interface UserData {
  church: string;
  createdAt: Date;
  department: string;
  grade: string;
  group: string;
  role: TeacherRole;
  isAccepted: boolean;
  isRejected: boolean;
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

export interface AccountCreateUserParams {
  uid: string;
  church: string;
  department: string;
  role: TeacherRole;
  grade: string;
  group: string;
  //
  isAccepted: boolean;
  isRejected: boolean;
}

export interface AccountFetchUserParams {
  uid: string;
}

export interface AccountDeleteUserParams {
  uid: string;
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

export interface AttendaceAddAttendanceParams {
  church: string;
  department: string;
  grade: string;
  group: string;
  attendances: DataSource[];
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

export interface MembersFetchByGradeGroupParams
  extends Pick<UserInfo, 'church' | 'department'> {
  grade: string;
  group: string;
}
