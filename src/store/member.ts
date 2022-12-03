import arraySort from 'array-sort';

import { defineStore } from 'pinia';

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db, membersColl } from '@/firebase/config';

import {
  Member,
  UserInfo,
  MemberPosition,
  TeacherRole,
  Teacher,
} from '@/types';

import {
  MembersFetchAllParmas,
  MembersFetchByGradeGroupParams,
} from '@/types/store';

interface MembersCreateParams extends Pick<UserInfo, 'church' | 'department'> {
  members: Member[];
  // position: MemberPosition;
}

// TODO: CreateParams와 같은 값이다. 리펙토링할 때 수정해보자
interface ModifyParams extends Partial<Member>, Partial<Teacher> {
  position: MemberPosition;
}

interface RemoveParams {
  uids: string[];
}

export const useMemberStore = defineStore('member', {
  state: () => ({}),
  actions: {
    create(params: MembersCreateParams) {
      const { church, department, members } = params;

      members.forEach(async (member) => {
        const params = {
          ...member,
          church,
          department,
          createdAt: serverTimestamp(),
        };
        return await addDoc(collection(db, 'newMembers'), params);
      });
    },

    async fetchAll(params: MembersFetchAllParmas) {
      const { church, department, position } = params;
      const q = query(
        membersColl,
        where('church', '==', church),
        where('department', '==', department),
        where('position', '==', position)
      );

      const qSnapshot = await getDocs(q);
      const members = qSnapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      }));

      return arraySort(members, ['grade', 'group', 'name']);
    },

    async fetchByGradeGroup(params: MembersFetchByGradeGroupParams) {
      const { church, department, grade, group } = params;

      const q = query(
        membersColl,
        where('church', '==', church),
        where('department', '==', department),
        where('grade', '==', grade),
        where('group', '==', group)
      );
      const qSnapshot = await getDocs(q);

      let members = qSnapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      })) as Member[];

      return arraySort(members, ['grade', 'group', 'name']);
    },

    async modify(params: ModifyParams) {
      // const { _id, church, department, position, ...memberParams } = params;
      // const q = query(
      //   membersColl,
      //   where('church', '==', church),
      //   where('department', '==', department),
      //   where('position', '==', position)
      // );
      // const qSnapshot = await getDocs(q);
      // if (!qSnapshot.empty) {
      //   const docId = qSnapshot.docs[0].id;
      //   const docData = qSnapshot.docs[0].data();
      //   docData.members.forEach((member: Student) => {
      //     if (member._id === _id) Object.assign(member, memberParams);
      //   });
      //   return await updateDoc(doc(db, 'members', docId), {
      //     members: docData.members,
      //     updatedAt: serverTimestamp(),
      //   });
      // }
    },

    async remove(params: RemoveParams) {
      const { uids } = params;

      uids.forEach(async (uid) => {
        await deleteDoc(doc(db, 'newMembers', uid));
      });
    },
  },
});
