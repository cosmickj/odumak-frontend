import type { MemberPosition, TeacherRole } from '@/types';

const getPositionFromRole = (role: TeacherRole): MemberPosition => {
  if (role === 'admin') {
    return 'teacher';
  }
  // role === 'teacher'
  else {
    return 'student';
  }
};

export { getPositionFromRole };
