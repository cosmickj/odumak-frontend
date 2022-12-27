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

interface MemberModifyMultipleParams {
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

    modifyMultiple(params: MemberModifyMultipleParams) {
      // const { members } = params;

      params.members.forEach(async (member) => {
        const {
          name,
          birth,
          gender,
          grade,
          group,
          phone,
          address,
          registeredAt,
          remark,
          uid,
        } = member;

        if (uid) {
          await updateDoc(doc(db, 'newMembers', uid), {
            name,
            birth,
            gender,
            grade,
            group,
            phone,
            address,
            registeredAt,
            remark,
            updatedAt: serverTimestamp(),
          });
        }
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
