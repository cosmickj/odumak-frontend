import { Gender, Job, MemberData, Role, UserData } from '@/types';

export class Member implements MemberData {
  uid?: string;
  name: string;
  church: string;
  department: string;
  grade: string;
  group: string;
  job: Job;
  role: Role;
  gender: Gender;
  birth: Date | null;
  birthLater: boolean;
  isNewFriendClass: boolean;
  remark: string;
  registeredAt: Date | null;
  createdAt?: Date;

  constructor(data: MemberData) {
    this.uid = data.uid;
    this.name = data.name;
    this.church = data.church;
    this.department = data.department;
    this.grade = data.grade;
    this.group = data.group;
    this.job = data.job;
    this.role = data.role;
    this.gender = data.gender;
    this.birth = data.birth;
    this.birthLater = data.birthLater;
    this.isNewFriendClass = data.isNewFriendClass;
    this.remark = data.remark;
    this.registeredAt = data.registeredAt;
    this.createdAt = data.createdAt;
  }
}

export class User implements UserData {
  uid: string;
  name: string;
  email: string;
  provider: 'naver' | 'kakao';
  profileImage: string;
  gender: Gender;
  birth: Date | null;
  birthLater: boolean;
  church: string;
  department: string;
  grade: string;
  group: string;
  job: Job;
  role: Role;
  isNewFriendClass: boolean;
  isAccepted: boolean;
  isRejected: boolean;
  rejectedReason: string;
  remark: string;
  registeredAt: Date | null;
  createdAt?: Date;

  constructor(data: UserData) {
    this.uid = data.uid;
    this.name = data.name;
    this.email = data.email;
    this.provider = data.provider;
    this.profileImage = data.profileImage;
    this.gender = data.gender;
    this.birth = data.birth;
    this.birthLater = data.birthLater;
    this.church = data.church;
    this.department = data.department;
    this.grade = data.grade;
    this.group = data.group;
    this.job = data.job;
    this.role = data.role;
    this.isNewFriendClass = data.isNewFriendClass;
    this.isAccepted = data.isAccepted;
    this.isRejected = data.isRejected;
    this.rejectedReason = data.rejectedReason;
    this.remark = data.remark;
    this.registeredAt = data.registeredAt;
    this.createdAt = data.createdAt;
  }
}
