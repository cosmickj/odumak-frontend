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

/** attendace.ts */
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
interface MemberCreateMultipleParams
  extends Pick<AccountData, 'church' | 'department'> {
  members: MemberData[];
}

export interface MemberFetchAllParmas
  extends Pick<AccountData, 'church' | 'department'> {
  job: 'student' | 'teacher';
}

export interface MemberFetchByGradeGroupParams
  extends Pick<AccountData, 'church' | 'department'> {
  grade: string;
  group: string;
}

interface MemberModifySingleParams {
  uid: string;
  field: string;
  value: string;
}

interface MemberRemoveMultipleParams {
  uids: (string | undefined)[];
}

/** user.ts */
export interface UserCreateSingleParams extends Omit<UserData, 'createdAt'> {
  uid: string;
  provider: 'naver' | 'kakao' | 'email';
}

export interface UserFetchSingleParams {
  uid: string;
}

export interface UserFetchMultipleByChurchAndDepartment {
  church: string;
  department: string;
}

export interface UserModifySingle {
  uid: string;
  [key: string]: any;
}

export interface UserDeleteSingleParams {
  uid: string;
}
