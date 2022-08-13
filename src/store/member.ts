import { defineStore } from 'pinia';
import {
  addDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db, membersColl } from '@/firebase/config';
import arraySort from 'array-sort';
import type { AddStudentParams, MemberPosition, TeacherRole } from '@/types';
import type { AccountData } from '@/types/store';

interface DefaultPayload
  extends AddStudentParams,
    Pick<AccountData, 'church' | 'department'> {
  position: MemberPosition;
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

    async modifyMember(payload: any) {
      const { church, department, index, position, ...params } = payload;

      const q = query(
        membersColl,
        where('church', '==', church),
        where('department', '==', department),
        where('position', '==', position)
      );

      const querySnapshot = await getDocs(q);

      const documentId = querySnapshot.docs[0].id;

      let members = querySnapshot.docs[0].data().members;
      members[index] = params;

      await updateDoc(doc(db, 'members', documentId), {
        members,
        updatedAt: serverTimestamp(),
      });

      return;
    },

    async removeMember(payload: any) {
      const { church, department, index, position, ...params } = payload;

      const q = query(
        membersColl,
        where('church', '==', church),
        where('department', '==', department),
        where('position', '==', position)
      );

      const querySnapshot = await getDocs(q);
      const documentId = querySnapshot.docs[0].id;

      let members = querySnapshot.docs[0].data().members;

      members.splice(index, 1);

      await updateDoc(doc(db, 'members', documentId), {
        members,
        updatedAt: serverTimestamp(),
      });

      return;
    },

    // async fetchMembers(payload: Omit<DefaultPayload, keyof State>) {
    async fetchMembers(payload: {
      church: string | undefined;
      department: string | undefined;
      grade?: string;
      group?: string;
      position: MemberPosition;
      role?: TeacherRole;
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
          members.forEach(
            (member: any, idx: number) => (member['index'] = idx)
          );

          if (role === 'admin') {
            // pass
          } else if (role === 'main' || role === 'sub') {
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
