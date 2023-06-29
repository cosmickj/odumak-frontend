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

import { COLLECTION } from '@/constants/common';
import type { MemberData } from '@/types';
import type {
  CreateMultipleParams,
  FetchAllParmas,
  FetchByGradeGroupParams,
  ModifySingleParams,
  RemoveMultipleParams,
} from '@/types/store';

export const useMemberStore = defineStore('member', {
  state: () => ({}),
  actions: {
    createMultiple(params: CreateMultipleParams) {
      const { church, department, members } = params;

      members.forEach(async (member) => {
        const param = {
          ...member,
          church,
          department,
          createdAt: serverTimestamp(),
        };
        return await addDoc(collection(db, COLLECTION.MEMBERS), param);
      });
    },

    async fetchAll(params: FetchAllParmas) {
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

      members.forEach((member) => {
        if (member.birth) {
          member.birth = (member.birth as unknown as Timestamp).toDate();
        }
        if (member.registeredAt) {
          member.registeredAt = (
            member.registeredAt as unknown as Timestamp
          ).toDate();
        }
      });

      return arraySort(members, ['grade', 'group', 'name']);
    },

    async fetchByGradeGroup(params: FetchByGradeGroupParams) {
      const { church, department, grade, group, job } = params;

      const whereGrade = grade !== '0' ? [where('grade', '==', grade)] : [];

      const q = query(
        membersColl,
        where('church', '==', church),
        where('department', '==', department),
        ...whereGrade,
        where('group', '==', group),
        where('job', '==', job)
      );
      const qSnapshot = await getDocs(q);

      // TODO: MemberData를 class로 만들어서 인스턴스를 만들어보자
      const members = qSnapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      })) as MemberData[];

      return arraySort(members, ['grade', 'group', 'name']);
    },

    async fetchByName(params: {
      church: string;
      department: string;
      name: string;
    }) {
      const { church, department, name } = params;

      const q = query(
        membersColl,
        where('church', '==', church),
        where('department', '==', department),
        where('name', '==', name)
      );
      const qSnapshot = await getDocs(q);

      const member = qSnapshot.docs.map((doc) => doc.data());

      return member;
    },

    // async modifySingle(params: ModifySingleParams) {
    //   return await updateDoc(doc(db, COLLECTION.MEMBERS, params.uid), {
    //     [params.field]: params.value,
    //   });
    // },

    async modifySingle(params: ModifySingleParams) {
      const { uid, ...data } = params;
      return await updateDoc(doc(db, COLLECTION.MEMBERS, uid), { ...data });
    },

    async removeMultiple(params: RemoveMultipleParams) {
      return await Promise.all(
        params.uids.map(async (uid) => {
          if (uid) await deleteDoc(doc(db, COLLECTION.MEMBERS, uid));
        })
      );
    },
  },
});
