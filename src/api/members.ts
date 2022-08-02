import { instance } from './index';

const fetchStudents = () => {
  return instance.get('/notion/students');
};

const fetchTeachers = () => {
  return instance.get('/notion/teachers');
};

export { fetchStudents, fetchTeachers };
