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
  name: string;
  birth: string;
  attendance: string;
}

export interface UserInfo {
  name: string;
  email: string;
  createdAt: Date;
}
