import { Gender, UserRole } from '@/types';

const formatDate = (date: Date) => {
  const _year = date.getFullYear();
  const _month = date.getMonth() + 1;
  const _date = date.getDate();
  return `${_year}년 ${_month}월 ${_date}일`;
};

const formatGender = (value: Gender) => {
  if (value === 'male') return '남자';
  else if (value === 'female') return '여자';
  else return '';
};

const formatRole = (value: UserRole) => {
  if (value === 'admin') return '관리자';
  else if (value === 'common') return '일반교사';
  else if (value === 'main') return '담임';
  else if (value === 'sub') return '부담임';
  else return '';
};

export { formatDate, formatGender, formatRole };
