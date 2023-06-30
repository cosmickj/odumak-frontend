// https://firebase.google.com/docs/reference/js/firestore_.firestoredataconverter.md

import type {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from 'firebase/firestore';
import { Member, User } from '@/models';

const memberConverter: FirestoreDataConverter<Member> = {
  toFirestore: (member: WithFieldValue<Member>): DocumentData => {
    return { ...member };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot<Member>,
    options?: SnapshotOptions
  ) {
    const data = snapshot.data(options);
    return new Member(data);
  },
};

const userConverter: FirestoreDataConverter<User> = {
  toFirestore: (user: WithFieldValue<User>): DocumentData => {
    return { ...user };
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<User>,
    options?: SnapshotOptions
  ): User => {
    const data = snapshot.data(options);
    return new User(data);
  },
};

export { memberConverter, userConverter };
