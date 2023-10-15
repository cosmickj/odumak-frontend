import { Gender, MemberData, Role, AttendanceStatus } from '@/types';

export const formatClassName = (grade: string, group: string) => {
  if (grade === '0' || group === '0') {
    return '새친구 학급';
  }
  return `${grade}학년 ${group}반`;
};

export const formatDate = (date: Date | null) => {
  if (date) {
    const yyyy = date.getFullYear();
    const mm = date.getMonth() + 1;
    const dd = date.getDate();

    return `${yyyy}.${mm}.${dd}`;
  }
  return '-';
};

const GenderMap = {
  male: '남',
  female: '여',
};
export const formatGender = (g: Gender) => GenderMap[g];

export const formatGroupHeader = ({ grade, group, job, role }: MemberData) => {
  if (job === 'student') {
    return `${grade}학년 ${group !== '0' ? group + '반' : '새친구'}`;
  }
  if (job === 'teacher') {
    if (role.teacher === 'common') {
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

const TeacherMap = {
  admin: '관리자',
  head: '담임',
  assistant: '부담임',
  common: '비담임',
};
export const formatTeacher = (t: Role['teacher']) => (t ? TeacherMap[t] : '');

const TeacherColorMap = {
  admin: '#6A2C70',
  head: '#7D5A50',
  assistant: '#B4846C',
  common: '#B7C4CF',
};
export const formatTeacherColor = (t: Role['teacher']) =>
  t ? TeacherColorMap[t] : '';

const AttendanceStatusMap = {
  offline: '현장',
  online: '온라인',
  absence: '결석',
};

export const formatAttendanceStatus = (s: AttendanceStatus) =>
  s ? AttendanceStatusMap[s] : '-';
