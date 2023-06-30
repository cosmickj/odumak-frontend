import { Timestamp } from 'firebase/firestore';

export type Gender = 'male' | 'female';

export type Job = 'student' | 'teacher';

export type Status = 'offline' | 'online' | 'absence';

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
  grade: string;
  group: string;
}

export interface MemberData extends BaseData {
  uid?: string;
  role: Role;
  gender: Gender;
  birth: Date | null;
  birthLater: boolean;
  isNewFriendClass: boolean;
  remark: string;
  registeredAt: Date | null;
  createdAt?: Date;
}

export interface UserData extends MemberData, OAuthData {
  uid: string;
  isAccepted: boolean;
  isRejected: boolean;
  rejectedReason: string;
  createdAt?: Date;
}

export interface AttendanceData extends BaseData {
  uid: string;
  memberUid: string;
  attendance: { date: Date | Timestamp; status: Status };
  createdAt?: Date;
  createdBy?: string;
}

export interface Option {
  label: string;
  value: string;
}

export interface NewStudent extends MemberData {
  id: number;
}
