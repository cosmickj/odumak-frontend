import { UserData } from './index';

/** account.ts */
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

export interface AttendaceAddAttendancesParams
  extends Omit<AttendaceAddAttendanceParams, 'attendance'> {
  attendances: DataSource[];
  checksum: string;
}

export interface AttendaceAddAttendanceParams {
  attendance: DataSource;
  church: string;
  department: string;
  grade: string;
  group: string;
}

export interface AttendaceRemoveAttendanceParams
  extends AttendaceAddAttendanceParams {}

/** member.ts */
export interface Member {
  church: string;
  department: string;
  members: Teacher[] | Student[];
  position: MemberPosition;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}

export interface MemberFetchAllParmas
  extends Pick<AccountData, 'church' | 'department'> {}

export interface MemberFetchByGradeGroupParams
  extends Pick<AccountData, 'church' | 'department'> {
  grade: string;
  group: string;
}

/** user.ts */
export interface UserCreateSingleParams extends Omit<UserData, 'createdAt'> {
  uid: string;
}

export interface UserFetchSingleParams {
  uid: string;
}

export interface UserDeleteSingleParams {
  uid: string;
}
