import type { UserRole } from '@/types';

const getPositionFromRole = (role: UserRole): any => {
  if (role === 'admin') {
    return 'teacher';
  }
  // role === 'teacher'
  else {
    return 'student';
  }
};

export { getPositionFromRole };
