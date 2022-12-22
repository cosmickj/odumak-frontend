import { defineStore } from 'pinia';

import arraySort from 'array-sort';
import { db, membersColl } from '@/firebase/config';
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

import type { AccountData, MemberData } from '@/types';
import type {
  MemberFetchAllParmas,
  MemberFetchByGradeGroupParams,
} from '@/types/store';

interface MemberCreateMultipleParams
  extends Pick<AccountData, 'church' | 'department'> {
  members: MemberData[];
}

interface MemberModifyMultipleParams
  extends Pick<AccountData, 'church' | 'department'> {
  members: MemberData[];
}

interface MemberRemoveMultipleParams {
  uids: (string | undefined)[];
}

export const useMemberStore = defineStore('member', {
  state: () => ({}),
  actions: {
    createMultiple(params: MemberCreateMultipleParams) {
      const { church, department, members } = params;

      members.forEach(async (member) => {
        const param = {
          ...member,
          church,
          department,
          createdAt: serverTimestamp(),
        };
        return await addDoc(collection(db, 'newMembers'), param);
      });
    },

    async fetchAll(params: MemberFetchAllParmas) {
      const { church, department } = params;

      const q = query(
        membersColl,
        where('church', '==', church),
        where('department', '==', department)
      );
      const qSnapshot = await getDocs(q);

      const members = qSnapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      })) as MemberData[];

      return arraySort(members, ['grade', 'group', 'name']);
    },

    async fetchByGradeGroup(params: MemberFetchByGradeGroupParams) {
      const { church, department, grade, group } = params;

      const q = query(
        membersColl,
        where('church', '==', church),
        where('department', '==', department),
        where('grade', '==', grade),
        where('group', '==', group)
      );
      const qSnapshot = await getDocs(q);

      const members = qSnapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      })) as MemberData[];

      return arraySort(members, ['grade', 'group', 'name']);
    },

    async modifyMultiple(params: MemberModifyMultipleParams) {
      const { church, department, members } = params;

      console.log(members);

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

    removeMultiple(params: MemberRemoveMultipleParams) {
      params.uids.forEach(async (uid) => {
        if (uid) {
          await deleteDoc(doc(db, 'newMembers', uid));
        }
      });
    },
  },
});
