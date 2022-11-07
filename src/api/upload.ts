import { instance } from './index';

const uploadFile = (file: FormData) => {
  return instance.post('/upload-file', file, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export { uploadFile };
