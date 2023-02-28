import arraySort from 'array-sort';

import { defineStore } from 'pinia';
import { db, membersColl } from '@/firebase/config';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';

import type { MemberData } from '@/types';
import type {
  MemberCreateMultipleParams,
  MemberFetchAllParmas,
  MemberFetchByGradeGroupParams,
  MemberModifySingleParams,
  MemberRemoveMultipleParams,
} from '@/types/store';

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
      const { church, department, job } = params;

      const q = query(
        membersColl,
        where('church', '==', church),
        where('department', '==', department),
        where('job', '==', job)
      );
      const qSnapshot = await getDocs(q);

      const members = qSnapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      })) as MemberData[];

      members.forEach((m) => {
        m.birth = (m.birth as unknown as Timestamp).toDate();
        m.registeredAt = (m.registeredAt as unknown as Timestamp).toDate();
      });

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

    async modifySingle(params: MemberModifySingleParams) {
      return await updateDoc(doc(db, 'newMembers', params.uid), {
        [params.field]: params.value,
      });
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
