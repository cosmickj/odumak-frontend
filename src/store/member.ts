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
  updateDoc,
  where,
} from 'firebase/firestore';
import { memberConverter } from '@/utils/useConverter';
import { COLLECTION } from '@/constants/common';

import type {
  CreateMultipleParams,
  FetchAllParmas,
  FetchByGradeGroupParams,
  FetchByNameParams,
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
        where('job', '==', job),
        where('church', '==', church),
        where('department', '==', department)
      );
      const qSnapshot = await getDocs(q);

      const members = qSnapshot.docs.map((doc) => ({
        ...memberConverter.fromFirestore(doc),
        uid: doc.id,
      }));

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

      const members = qSnapshot.docs.map((doc) => ({
        ...memberConverter.fromFirestore(doc),
        uid: doc.id,
      }));

      return arraySort(members, ['grade', 'group', 'name']);
    },

    async fetchByName(params: FetchByNameParams) {
      const { church, department, name } = params;

      const q = query(
        membersColl,
        where('name', '==', name),
        where('church', '==', church),
        where('department', '==', department)
      );
      const qSnapshot = await getDocs(q);

      return qSnapshot.docs.map((doc) => {
        return memberConverter.fromFirestore(doc);
      });
    },

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
