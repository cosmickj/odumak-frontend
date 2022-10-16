import type { Option } from '@/types';

const grade: Option[] = [
  { label: '3학년', value: '3' },
  { label: '4학년', value: '4' },
];

const group: Option[] = [
  { label: '1반', value: '1' },
  { label: '2반', value: '2' },
  { label: '3반', value: '3' },
  { label: '4반', value: '4' },
  { label: '5반', value: '5' },
  { label: '6반', value: '6' },
  { label: '7반', value: '7' },
  { label: '8반', value: '8' },
  { label: '9반', value: '9' },
  { label: '10반', value: '10' },
];

const gender: Option[] = [
  { label: '남자', value: 'male' },
  { label: '여자', value: 'female' },
];

const teacherRole: Option[] = [
  { label: '담임', value: 'main' },
  { label: '부담임', value: 'sub' },
  { label: '일반교사', value: 'common' },
];

const getBirthYear = () => {
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 100;
  let years = [];
  for (let y = currentYear; y >= minYear; y--) {
    years.push({ label: `${y}년`, value: y.toString() });
  }
  return years;
};

const getBirthMonth = () => {
  const minMonth = 1;
  const maxMonth = 12;
  let months = [];
  for (let m = minMonth; m <= maxMonth; m++) {
    months.push({ label: `${m}월`, value: m.toString() });
  }
  return months;
};

const getBirthDate = () => {
  const minDate = 1;
  const maxDate = 31;
  let days = [];
  for (let d = minDate; d <= maxDate; d++) {
    days.push({ label: `${d}일`, value: d.toString() });
  }
  return days;
};

const birthYear: Option[] = getBirthYear();
const birthMonth: Option[] = getBirthMonth();
const birthDate: Option[] = getBirthDate();

export { birthYear, birthMonth, birthDate, gender, grade, group, teacherRole };
