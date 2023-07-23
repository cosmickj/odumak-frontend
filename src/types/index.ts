import type { Timestamp } from 'firebase/firestore';

export type Gender = 'male' | 'female';

export type Job = 'student' | 'teacher';

export type Status = 'offline' | 'online' | 'absence' | null;

export type System = 'admin' | 'user';

export type Teacher = 'head' | 'assistant' | 'common';

export type Executive =
  | 'director' // 부장
  | 'deputyDirector' // 차장
  | 'generalAffairs' // 총무
  | 'accountant' // 회계
  | 'secretary'; // 서기

export type Officer =
  // 번역 참고: https://jcwebs.net/english/?uid=1&mod=document
  | 'pastor' // 목사
  | 'evangelist' // 전도사
  | 'missionary' // 선교사
  | 'elder' // 장로
  | 'seniorDeaconess' // 권사
  | 'ordainedDeacon' // 안수 집사
  | 'deacon' // 남자 집사
  | 'deaconess' // 여자 집사
  | 'deputyDeacon' // 남자 서리집사
  | 'deputyDeaconess' // 여자 서리집사
  | 'layman'; // 평신도

export interface Role {
  system?: System;
  teacher?: Teacher;
  executive?: Executive;
  officer?: Officer;
  [key: string]: string | undefined;
}

export interface OAuthData {
  email: string;
  provider: 'naver' | 'kakao';
  profileImage: string;
}

export interface BaseData {
  name: string;
  church: string;
  department: string;
  job: Job;
  role: Role;
  grade: string;
  group: string;
}

export interface MemberData extends BaseData {
  uid: string;
  gender: Gender;
  birth: Date | null;
  birthLater: boolean;
  isNewFriendClass: boolean;
  remark: string;
  registeredAt?: Timestamp;
  createdAt?: Timestamp;
}

export interface UserData extends OAuthData, MemberData {
  uid: string;
  isAccepted: boolean;
  isRejected: boolean;
  rejectedReason: string;
  createdAt: Timestamp;
}

export interface AttendanceData extends Omit<BaseData, 'role'> {
  uid: string;
  memberUid: string;
  role?: Role;
  attendance: { date: Date; status: Status };
  createdAt?: Timestamp;
  createdBy?: string;
}

export interface Option {
  label: string;
  value: string;
}
