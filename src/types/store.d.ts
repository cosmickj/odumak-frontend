// account.ts
export interface AccountData {
  createdAt: {
    nanoseconds: number;
    seconds: number;
  };
  grade: string;
  group: string;
  role: string;
}

export interface UserData extends AccountData {
  email: string;
  name: string;
  uid: string;
}

// attendace.ts
export interface StudentsAttendance {
  date: Date;
  grade: string;
  group: string;
  studentsAttendance: Student[];
  teacher: string;
}

export interface TeachersAttendance {
  date: Date;
  teachersAttendance: Teacher[];
}

export interface Members {
  church: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  department: string;
  members: Teacher[] | Student[];
  position: string;
}
