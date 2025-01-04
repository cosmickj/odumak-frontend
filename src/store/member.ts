import arraySort from 'array-sort';
import { addDoc, collection, doc, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { defineStore } from 'pinia';
import type {
  CreateMultipleParams,
  FetchAllParmas,
  FetchByGradeGroupParams,
  FetchByNameParams,
  ModifySingleParams,
  ModifyMultipleParams,
} from '@/types/store';
import { db, membersColl } from '@/firebase/config';
import { memberConverter } from '@/utils/useConverter';
import { COLLECTION } from '@/constants/common';

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

        // TODO: 전에 있던 인원이 복귀하였을 경우에 대한 로직 추가하기
        return await addDoc(collection(db, COLLECTION.MEMBERS), param);
      });
    },

    async fetchAll(params: FetchAllParmas) {
      const { church, department, job } = params;

      const q = query(
        membersColl,
        where('job', '==', job),
        where('church', '==', church),
        where('department', '==', department),
        where('status', '==', 'active')
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
        where('job', '==', job),
        where('status', '==', 'active')
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

    async modifyMultiple(params: ModifyMultipleParams) {
      try {
        await Promise.all(
          params.uids.map(async (uid) => {
            if (uid) {
              await updateDoc(doc(db, COLLECTION.MEMBERS, uid), params.data);
            }
          })
        );
        return 'Success';
      } catch (error) {
        console.error('Error removing documents:', error);
        throw error;
      }
    },
  },
});
