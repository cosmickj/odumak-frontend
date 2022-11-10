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
import {
  Student,
  UserInfo,
  MemberPosition,
  TeacherRole,
  Teacher,
} from '@/types';

interface FetchAllParmas extends Pick<UserInfo, 'church' | 'department'> {
  position: MemberPosition;
}

interface CreateParams extends Pick<UserInfo, 'church' | 'department'> {
  members: Student[] | Teacher[];
  position: MemberPosition;
}

interface CreateTemplateParams extends Pick<UserInfo, 'church' | 'department'> {
  members: [];
  position: MemberPosition;
  createdAt: unknown;
}

// TODO: CreateParams와 같은 값이다. 리펙토링할 때 수정해보자
interface ModifyParams
  extends Partial<Student>,
    Partial<Teacher>,
    Pick<UserInfo, 'church' | 'department'> {
  position: MemberPosition;
}

interface RemoveParams extends Pick<UserInfo, 'church' | 'department'> {
  ids: string[];
  position: MemberPosition;
}

export const useMemberStore = defineStore('member', {
  state: () => ({}),
  actions: {
    async fetchAll(params: FetchAllParmas) {
      const { church, department, position } = params;

      const q = query(
        membersColl,
        where('church', '==', church),
        where('department', '==', department),
        where('position', '==', position)
      );
      const qSnapshot = await getDocs(q);

      if (qSnapshot.empty) {
        await this.createTemplate({
          church,
          department,
          members: [],
          position,
          createdAt: serverTimestamp(),
        });
        await this.fetchAll(params);
      } else {
        const members = qSnapshot.docs[0].data().members;
        return arraySort(members, ['grade', 'group', 'name']);
      }
    },

    async create(params: CreateParams) {
      const { church, department, position, members } = params;

      const q = query(
        membersColl,
        where('church', '==', church),
        where('department', '==', department),
        where('position', '==', position)
      );
      const qSnapshot = await getDocs(q);

      if (!qSnapshot.empty) {
        const docId = qSnapshot.docs[0].id;
        const docData = qSnapshot.docs[0].data();
        docData.members.push(...members);

        return await setDoc(doc(db, 'members', docId), docData);
      }
    },

    async createTemplate(params: CreateTemplateParams) {
      return await addDoc(membersColl, params);
    },

    async modify(params: ModifyParams) {
      const { _id, church, department, position, ...memberParams } = params;

      const q = query(
        membersColl,
        where('church', '==', church),
        where('department', '==', department),
        where('position', '==', position)
      );
      const qSnapshot = await getDocs(q);

      if (!qSnapshot.empty) {
        const docId = qSnapshot.docs[0].id;
        const docData = qSnapshot.docs[0].data();

        docData.members.forEach((member: Student) => {
          if (member._id === _id) Object.assign(member, memberParams);
        });

        return await updateDoc(doc(db, 'members', docId), {
          members: docData.members,
          updatedAt: serverTimestamp(),
        });
      }
    },

    async remove(params: RemoveParams) {
      const { ids, church, department, position } = params;

      const q = query(
        membersColl,
        where('church', '==', church),
        where('department', '==', department),
        where('position', '==', position)
      );
      const qSnapshot = await getDocs(q);

      if (!qSnapshot.empty) {
        const docId = qSnapshot.docs[0].id;
        const docData = qSnapshot.docs[0].data();

        const members = docData.members.filter((member: Student) => {
          return !ids.includes(member._id);
        });

        return await updateDoc(doc(db, 'members', docId), {
          members,
          updatedAt: serverTimestamp(),
        });
      }
    },

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
