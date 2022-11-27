import { defineStore } from 'pinia';
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
import { db, membersColl } from '@/firebase/config';
import arraySort from 'array-sort';
import {
  Student,
  UserInfo,
  MemberPosition,
  TeacherRole,
  Teacher,
} from '@/types';
import { MembersFetchAllParmas } from '@/types/store';

interface CreateParams extends Pick<UserInfo, 'church' | 'department'> {
  members: Student[] | Teacher[];
  position: MemberPosition;
}

// TODO: CreateParams와 같은 값이다. 리펙토링할 때 수정해보자
interface ModifyParams
  extends Partial<Student>,
    Partial<Teacher>,
    Pick<UserInfo, 'church' | 'department'> {
  position: MemberPosition;
}

interface RemoveParams {
  uids: string[];
}

export const useMemberStore = defineStore('member', {
  state: () => ({}),
  actions: {
    async fetchAll(params: MembersFetchAllParmas) {
      const { church, department, position } = params;
      const q = query(
        membersColl,
        where('church', '==', church),
        where('department', '==', department),
        where('position', '==', position)
      );

      const qSnapshot = await getDocs(q);
      const members = qSnapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      }));

      return arraySort(members, ['grade', 'group', 'name']);
    },

    create(params: CreateParams) {
      const { church, department, position, members } = params;
      members.forEach(async (member) => {
        const params = {
          church,
          department,
          position,
          createdAt: serverTimestamp(),
          ...member,
        };
        return await addDoc(collection(db, 'newMembers'), params);
      });
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
      const { uids } = params;

      uids.forEach(async (uid) => {
        await deleteDoc(doc(db, 'newMembers', uid));
      });
    },
  },
});
