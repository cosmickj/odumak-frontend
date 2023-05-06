import { Timestamp } from 'firebase/firestore';

/** Common */
export type Gender = 'male' | 'female';

/** Account */
export type UserRole = 'admin' | 'main' | 'sub' | 'common';

export interface UserData {
  uid: string;
  name: string;
  email: string;
  provider: 'naver' | 'kakao';
  profileImage: string | null;
  church: string | null;
  department: string | null;
  role: UserRole | null;
  grade: string | null;
  group: string | null;
  isAccepted: boolean;
  isRejected: boolean;
  rejectedReason: string;
  createdAt?: Date;
}

/** Member */
export interface MemberData {
  uid?: string;
  name: string;
  birth: Date | null;
  birthLater: boolean;
  gender: Gender;
  church: string;
  department: string;
  job: 'student' | 'teacher';
  role: UserRole | null;
  grade: string;
  group: string;
  phone: string; // TODO: 민감 정보 암호화 처리
  address: string; // TODO: 민감 정보 암호화 처리
  registeredAt: Date;
  remark: string;
  createdAt?: Date;
}

/** Attendance */
export interface AttendanceData
  extends Pick<
    MemberData,
    'name' | 'church' | 'department' | 'job' | 'grade' | 'group'
  > {
  uid: string;
  attendance: {
    date: Date | Timestamp;
    status: 'offline' | 'online' | 'absence';
  };
  createdAt?: Date;
  createdBy?: string;
}

/** Etc */
export interface Option {
  label: string;
  value: string;
}

export interface DataTableColumn {
  field: string;
  header: string;
  // sortable: boolean;
  minWidth?: string;
  format: undefined | Function;
}
