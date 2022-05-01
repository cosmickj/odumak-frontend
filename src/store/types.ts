export interface RootState {
  User: AccountState;
  Attendance: AttendanceState;
}

export interface AccountState {
  user: any;
  authIsReady: boolean;
}

export interface Teacher {
  name: string;
  grade: string;
  group: string;
}

export interface AttendanceState {
  teacherAttendance: "online" | "offline";
}
