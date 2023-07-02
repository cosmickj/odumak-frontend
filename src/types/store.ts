import type { Member, User } from '@/models';
import { Job, Status, MemberData, UserData } from './index';

/*---------- attendace.ts ----------*/
export interface AddAttendanceParams {
  memberUid: string;
  name: string;
  church: string;
  department: string;
  grade: string;
  group: string;
  job: Job;
  attendance: { date: Date; status: Status };
  createdBy: string;
  createdAt?: Date;
}

export interface FetchAttendancesParams {
  attendanceDate: Date;
  church: string;
  department: string;
  grade?: string;
  group?: string;
  job: Job;
}

export interface ModifyAttendanceParams {
  uid: string;
  attendance: { status: Status | null };
}

/*---------- memberStore ----------*/
export interface CreateMultipleParams {
  church: string;
  department: string;
  members: Member[];
}

export interface FetchAllParmas {
  church: string;
  department: string;
  job: Job;
}

export interface FetchByGradeGroupParams {
  church: string;
  department: string;
  grade: string;
  group: string;
  job: Job;
}

export interface FetchByNameParams {
  name: string;
  church: string;
  department: string;
}

export interface ModifySingleParams {
  uid: string;
  [key: string]: any;
}

export interface RemoveMultipleParams {
  uids: (string | undefined)[];
}

/*---------- userStore ----------*/
// export interface CreateSingleParams extends Omit<UserData, keyof MemberData> {
//   uid: string;
//   name: string;
//   church: string;
//   department: string;
// }

export interface CreateSingleParams {
  uid: string;
  name: string;
  email: string;
  provider: 'naver' | 'kakao';
  profileImage: string;
  church: string;
  department: string;
  isAccepted: boolean;
  isRejected: boolean;
  rejectedReason: string;
}

export interface FetchSingleParams {
  uid: string;
}

export interface FetchMultipleByChurchAndDepartment {
  church: string;
  department: string;
}

export interface ModifySingle {
  uid: string;
  [key: string]: any;
}
