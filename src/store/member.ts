import { defineStore } from 'pinia';
import type { Position, State } from '@/types';
import type { AccountData } from '@/types/store';
import {
  addDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import { db, membersColl } from '@/firebase/config';
import arraySort from 'array-sort';

interface DefaultPayload
  extends State,
    Pick<AccountData, 'church' | 'department'> {
  position: Position;
}

export const useMemberStore = defineStore('member', {
  state: () => {
    return {};
  },
  actions: {
    async createMember(payload: DefaultPayload) {
      const { church, department, position, ...memberInfo } = payload;

      const q = query(
        membersColl,
        where('church', '==', church),
        where('department', '==', department),
        where('position', '==', position)
      );
      const querySnapshot = await getDocs(q);

      // 추가 등록
      if (querySnapshot.docs.length) {
        const docId = querySnapshot.docs[0].id;
        const docData = querySnapshot.docs[0].data();
        docData.members.push(memberInfo);

        return await setDoc(doc(db, 'members', docId), docData);
      }
      // 처음 등록
      else {
        const params = {
          church,
          createdAt: serverTimestamp(),
          department,
          members: [memberInfo],
          position,
        };
        return await addDoc(membersColl, params);
      }
    },

    // async fetchMembers(payload: Omit<DefaultPayload, keyof State>) {
    async fetchMembers(payload: {
      church: string | undefined;
      department: string | undefined;
      grade?: string;
      group?: string;
      position: 'student' | 'teacher';
      role?: 'admin' | 'teacher';
    }) {
      try {
        const { church, department, grade, group, position, role } = payload;

        const q = query(
          membersColl,
          where('church', '==', church),
          where('department', '==', department),
          where('position', '==', position)
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.docs.length) {
          let members = querySnapshot.docs[0].data().members;

          if (role === 'admin') {
            // pass
          } else if (role === 'teacher') {
            /** TODO : any 타입 정리하기 */
            members = members.filter(
              (member: any) => member.grade === grade && member.group === group
            );
          }
          return arraySort(members, ['grade', 'group', 'name']);
        } else {
          return [];
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
});
