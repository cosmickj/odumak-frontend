import type { User } from 'firebase/auth/dist/auth';

/** Common */
export type Gender = 'male' | 'female';

/** Account */
type Key = 'uid' | 'email' | 'displayName';

type AuthData = {
  -readonly [k in Key]: User[k];
};

export type UserRole = 'admin' | 'main' | 'sub' | 'common';

interface UserData {
  name: string;
  birth: Date | null;
  church: string;
  department: string;
  grade: string;
  group: string;
  role: UserRole;
  phone: string | null;
  isAccepted: boolean;
  isRejected: boolean;
  createdAt: Date;
}

export interface AccountData extends AuthData, UserData {}

/** Member */
export interface MemberData {
  uid?: string;
  name: string;
  birth: Date;
  gender: Gender;
  church: string;
  department: string;
  job: string;
  grade: string;
  group: string;
  phone: string;
  address: string;
  registeredAt: Date;
  remark: string;
  // attendances: Attendance[];
  attendance?: 'offline' | 'online' | 'absence';
  createdAt?: Date;
}

/** Attendance */
type AttendanceState = Pick<
  MemberData,
  'church' | 'department' | 'grade' | 'group'
>;

type AttendanceStatus = 'offline' | 'online' | 'absence';

export interface Attendance {
  state: AttendanceState;
  status: AttendanceStatus;
  attendedAt: Date;
  createdAt: Date;
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
