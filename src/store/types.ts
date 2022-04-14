import StudentAttendance from "@/types/StudentAttendance";

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
  students: any;
  record: any;
  studentsDailyAttendance: StudentAttendance[];
}
