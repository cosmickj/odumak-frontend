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

export { gender, grade, group };
