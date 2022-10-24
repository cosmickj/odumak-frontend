import { instance } from './index';

const getProfile = (token: string) => {
  return instance.post('/default/odumak-login-getProfile', {
    token: token,
  });
};

export { getProfile };
