import { instance } from './index';

const getKakaoToken = (code: string) => {
  return instance.post('/kakao-token', { code });
};

const getNaverOAuth = (token: string) => {
  return instance.post('/naver-oauth', { token });
};

const getCustomToken = (uid: string) => {
  return instance.post('/custom-token', { uid });
};

export { getKakaoToken, getNaverOAuth, getCustomToken };
