// https://firebase.google.com/docs/reference/js/firestore_.firestoredataconverter.md
import { Attendance, Member, User } from '@/models';
import type { AttendanceData, MemberData, UserData } from '@/types';
import type {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  WithFieldValue,
} from 'firebase/firestore';

const attendanceConverter: FirestoreDataConverter<Attendance> = {
  toFirestore: (attd: WithFieldValue<Attendance>): DocumentData => {
    return { ...attd };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot<AttendanceData>, options?) {
    const data = snapshot.data(options);
    return new Attendance(data);
  },
};

const memberConverter: FirestoreDataConverter<Member> = {
  toFirestore: (member: WithFieldValue<Member>): DocumentData => {
    return { ...member };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot<MemberData>, options?) {
    const data = snapshot.data(options);
    return new Member(data);
  },
};

const userConverter: FirestoreDataConverter<User> = {
  toFirestore: (user: WithFieldValue<User>): DocumentData => {
    return { ...user };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot<UserData>, options?) => {
    const data = snapshot.data(options);
    return new User(data);
  },
};

export { attendanceConverter, memberConverter, userConverter };
