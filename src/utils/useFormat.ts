import { Gender, MemberData, UserRole } from '@/types';

const formatDate = (date: Date | null) => {
  if (date) {
    const _year = date.getFullYear();
    const _month = date.getMonth() + 1;
    const _date = date.getDate();
    return `${_year}년 ${_month}월 ${_date}일`;
  }
  return '-';
};

const GenderMap = { male: '남자', female: '여자' };
const formatGender = (gender: Gender) => GenderMap[gender];

const RoleMap = {
  admin: '관리자',
  main: '담임',
  sub: '부담임',
  common: '해당없음',
};
const formatRole = (role: UserRole) => (role ? RoleMap[role] : '-');

const formatClass = ({ grade, group, job, role }: MemberData) => {
  if (job === 'student') {
    return `${grade}학년 ${group !== '0' ? group + '반' : '새친구'}`;
  }
  if (job === 'teacher') {
    if (role === 'common') {
      return '비담임교사';
    } else {
      return (
        `${grade !== '0' ? grade + '학년 ' : ''}` +
        `${group !== '0' ? group + '반' : '새친구 학급'}`
      );
    }
  }
  return;
};

export { formatDate, formatGender, formatRole, formatClass };
