export interface RootState {
  User: AccountState;
  Attendance: AttendanceState;
}

export interface AccountState {
  user: any;
  // account: any;
  authIsReady: any;
}

export interface Student {
  id?: string;
  name: string;
  birth: string;
  attendance: string;
  teacher?: string;
  grade?: string;
  group?: string;
  date?: Date | string;
}

export interface Teacher {
  name: string;
  grade: string;
  group: string;
}

export interface AttendanceState {
  students: Student[];
  teachers: Teacher[];
  hasRecord: boolean;
  attendanceStudentsDaily: any;
}
