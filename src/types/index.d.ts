export type Gender = 'male' | 'female';
export type MemberPosition = 'student' | 'teacher';
export type SubmitType = '추가하기' | '수정하기';
export type TeacherRole = 'admin' | 'main' | 'sub' | 'common';

/**
 * 총 세 개로 유저와 관련된 워딩이 정리되어야 한다.
 * 1. 오두막 어플에서 사용하는 유저 정보
 * 2. 파이어베이스 Auth에서 받아오는 유저 정보 (현재는 Account라는 워딩을 사용 중)
 * 3. 파이어베이스 DB에 따로 저장하는 유저 정보 (현재는 User라는 워딩을 사용 중)
 *
 * 2번과 3번이 합쳐져 1번 데이터가 된다.
 */

export interface UserInfo {
  church: string;
  createdAt: Date;
  department: string;
  email: string;
  grade: string;
  group: string;
  name: string;
  role: TeacherRole;
}

export interface Member {
  uid?: string;
  attendances: Attendance[];
  address: string;
  birth: Date;
  church?: string;
  createdAt?: Date;
  department?: string;
  gender: Gender;
  grade: string;
  group: string;
  name: string;
  phone: string;
  registeredAt: Date;
  remark: string;
}

// prettier-ignore
type AttendanceState = Pick<Member, 'church' | 'department' | 'grade' | 'group'>;
type AttendanceStatus = 'offline' | 'online' | 'absence';

export interface Attendance {
  attendedAt: Date;
  state: AttendanceState;
  status: AttendanceStatus;
  createdAt: Date;
}

export interface DataSource {
  uid: string;
  name: string;
  status: AttendanceStatus;
  targetIdx: number;
  attendedAt: Date;
  createdAt?: Date;
}

/**
 * 이제부터 관리자가 교사에 대한 출석체크를 할 때는 User 데이터 베이스를 보고 가져올 것이기 때문에
 * 해당 부분이 삭제되고 불러오는 데이터에 대한 타입을 다시 정리해야 한다.
 */
export interface Teacher {
  _id: string;
  grade: string;
  group: string;
  name: string;
  role: TeacherRole;
  birth: Date;
  gender: Gender;
  phone: string;
  registeredAt: Date;
  remark: string;
}

export interface Option {
  label: string;
  value: string;
}

export interface CustomColumn {
  field: string;
  header: string;
  sortable: boolean;
  format: undefined | Function;
}
