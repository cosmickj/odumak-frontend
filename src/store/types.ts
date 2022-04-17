import { Student } from "@/types/index";

export interface RootState {
  User: AccountState;
  Attendance: AttendanceState;
}

export interface AccountState {
  user: any;
  // account: any;
  authIsReady: any;
}

export interface AttendanceState {
  students: Student[];
  hasRecord: boolean;
  // record: any;
  // studentsDailyAttendance: StudentAttendance[];
}
