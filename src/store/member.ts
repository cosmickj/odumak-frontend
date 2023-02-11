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
  Timestamp,
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

    modifyMultiple(params: MemberModifyMultipleParams) {
      params.members.forEach(async (member) => {
        if (member.uid) {
          await updateDoc(doc(db, 'newMembers', member.uid), {
            name: member.name,
            birth: member.birth,
            gender: member.gender,
            grade: member.grade,
            group: member.group,
            phone: member.phone,
            address: member.address,
            registeredAt: member.registeredAt,
            remark: member.remark,
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
