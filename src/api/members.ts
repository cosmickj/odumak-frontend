import { instance } from './index';

const getData = (token: string) => {
  return instance.get('/', {
    // data: {
    //   token: token,
    // },
  });
};

export { getData };
