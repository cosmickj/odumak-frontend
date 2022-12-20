import { Gender, UserRole } from '@/types';

const formatBirth = (seconds: number | undefined) => {
  if (seconds) return new Date(seconds * 1000);
  else return;
};

const formatGender = (value: Gender) => {
  if (value === 'male') return '남자';
  else if (value === 'female') return '여자';
  else return '';
};

const formatRole = (value: UserRole) => {
  if (value === 'admin') return '관리자';
  else if (value === 'common') return '미담당';
  else if (value === 'main') return '담임';
  else if (value === 'sub') return '부담임';
  else return '';
};

export { formatBirth, formatGender, formatRole };
