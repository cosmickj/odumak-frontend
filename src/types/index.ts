// import type { User as FirebaseUser } from 'firebase/auth/dist/auth';
import { Timestamp } from 'firebase/firestore';

/** Common */
export type Gender = 'male' | 'female';

/** Account */
// type Key = 'uid' | 'email' | 'displayName';

// type AuthData = {
//   -readonly [k in Key]: FirebaseUser[k];
// };

export type UserRole = 'admin' | 'main' | 'sub' | 'common';

export interface UserData {
  uid: string;
  email: string;
  provider: 'naver' | 'kakao';
  profileImage: string | null;
  name: string;
  birth: Date | null;
  church: string | null;
  department: string | null;
  role: UserRole | null;
  grade: string | null;
  group: string | null;
  phone: string | null;
  isAccepted: boolean;
  isRejected: boolean;
  rejectedReason: string;
  createdAt?: Date;
}

// export interface AccountData extends UserData {
//   email: string;
// }

/** Member */
export interface MemberData {
  uid?: string;
  name: string;
  birth: Date | null;
  gender: Gender;
  church: string;
  department: string;
  job: 'student' | 'teacher';
  grade: string;
  group: string;
  phone: string;
  address: string;
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
