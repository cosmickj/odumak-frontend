import { MemberData, UserData } from './index';

/*---------- attendace.ts ----------*/
export interface AddAttendanceParams {
  name: string;
  church: string;
  department: string;
  grade: string;
  group: string;
  job: 'student' | 'teacher';
  attendance: {
    date: Date;
    status: 'online' | 'offline' | 'absence';
  };
  createdBy: string;
  createdAt?: Date;
}

export interface FetchAttendancesParams {
  attendanceDate: Date;
  church: string;
  department: string;
  grade?: string;
  group?: string;
  job: 'student' | 'teacher';
}

export interface ModifyAttendanceParams {
  uid: string;
  attendance: {
    status: 'online' | 'offline' | 'absence';
  };
}

/*---------- member.ts ----------*/
export interface CreateMultipleParams
  extends Pick<MemberData, 'church' | 'department'> {
  members: MemberData[];
}

export interface FetchAllParmas
  extends Pick<MemberData, 'church' | 'department' | 'job'> {}

export interface FetchByGradeGroupParams
  extends Pick<
    MemberData,
    'church' | 'department' | 'grade' | 'group' | 'job'
  > {}

// export interface ModifySingleParams {
//   uid: string;
//   field: string;
//   value: string;
// }

export interface ModifySingleParams {
  uid: string;
  [key: string]: any;
}

export interface RemoveMultipleParams {
  uids: (string | undefined)[];
}

/*---------- user.ts ----------*/
export interface CreateSingleParams extends Omit<UserData, 'createdAt'> {}

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

export interface DeleteSingleParams {
  uid: string;
}
