import { instance } from './index';

const getNaverOAuth = (token: string) => {
  return instance.post('/naver-oauth', { token });
};

const getCustomToken = (uid: string) => {
  return instance.post('/custom-token', { uid });
};

export { getNaverOAuth, getCustomToken };
