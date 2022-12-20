import type { MemberPosition, UserRole } from '@/types';

const getPositionFromRole = (role: UserRole): MemberPosition => {
  if (role === 'admin') {
    return 'teacher';
  }
  // role === 'teacher'
  else {
    return 'student';
  }
};

export { getPositionFromRole };
