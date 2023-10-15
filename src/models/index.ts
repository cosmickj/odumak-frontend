import type {
  Gender,
  Job,
  Role,
  AttendanceStatus,
  AttendanceData,
  MemberData,
  UserData,
  MemberStatus,
} from '@/types';

export class Member implements Omit<MemberData, 'registeredAt' | 'createdAt'> {
  uid: string;
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
  status: MemberStatus;
  registeredAt: Date;
  createdAt: Date;

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
    this.status = data.status;
    this.registeredAt = !data.registeredAt
      ? new Date()
      : new Date(data.registeredAt.seconds * 1000);
    this.createdAt = !data.createdAt
      ? new Date()
      : new Date(data.createdAt.seconds * 1000);
  }
}

export class User implements Omit<UserData, 'registeredAt' | 'createdAt'> {
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
  status: MemberStatus;
  registeredAt: Date;
  createdAt: Date;

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
    this.status = data.status;
    this.registeredAt = !data.registeredAt
      ? new Date()
      : new Date(data.registeredAt.seconds * 1000);
    this.createdAt = !data.createdAt
      ? new Date()
      : new Date(data.createdAt.seconds * 1000);
  }
}

export class Attendance implements Omit<AttendanceData, 'createdAt'> {
  uid: string;
  memberUid: string;
  name: string;
  attendance: { date: Date; status: AttendanceStatus };
  church: string;
  department: string;
  grade: string;
  group: string;
  job: Job;
  role?: Role;
  status: MemberStatus;
  createdAt?: Date;
  createdBy?: string;

  constructor(data: AttendanceData) {
    this.uid = data.uid;
    this.memberUid = data.memberUid;
    this.name = data.name;
    this.role = data.role;
    this.attendance = data.attendance;
    this.church = data.church;
    this.department = data.department;
    this.grade = data.grade;
    this.group = data.group;
    this.job = data.job;
    this.status = data.status;
    this.createdBy = data.createdBy;
    this.createdAt = !data.createdAt
      ? new Date()
      : new Date(data.createdAt.seconds * 1000);
  }
}
