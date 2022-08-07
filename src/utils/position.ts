const getPositionFromRole = (
  role: 'admin' | 'teacher' | 'common'
): 'teacher' | 'student' => {
  if (role === 'admin') {
    return 'teacher';
  }
  // role === 'teacher'
  else {
    return 'student';
  }
};

export { getPositionFromRole };
