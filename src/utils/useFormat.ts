import { Gender, MemberData, UserRole } from '@/types';

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

const formatDate = (date: Date | null) => {
  if (date) {
    const yyyy = date.getFullYear();
    const mm = date.getMonth() + 1;
    const dd = date.getDate();

    return `${yyyy}.${mm}.${dd}`; // return `${yyyy}년 ${mm}월 ${dd}일`;
  }
  return '-';
};

const GenderMap = { male: '남', female: '여' };
const formatGender = (gender: Gender) => GenderMap[gender];

const RoleMap = {
  admin: '관리자',
  main: '담임',
  sub: '부담임',
  common: '일반',
};
const formatRole = (role: UserRole) => (role ? RoleMap[role] : '-');

const RoleColorMap = {
  admin: '#6A2C70',
  main: '#7D5A50',
  sub: '#B4846C',
  common: '#B7C4CF',
};
const formatRoleColor = (role: UserRole) =>
  role ? RoleColorMap[role] : '#000';

export { formatClass, formatDate, formatGender, formatRole, formatRoleColor };
