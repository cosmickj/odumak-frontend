import { instance } from './index';

const upload = (file: FormData) => {
  return instance.post('/upload', file, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export { upload };
