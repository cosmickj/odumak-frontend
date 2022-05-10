export interface UserInfo {
  name: string;
  email: string;
  createdAt: Date;
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

export interface StudentAttendance {
  grade: string;
  group: string;
  name: string;
  teacher: string;
  attendance: string;
}

export interface TeacherAttendance {
  name: string;
  attendance: string;
}
