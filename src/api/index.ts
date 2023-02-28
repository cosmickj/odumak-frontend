import axios from 'axios';

const createInstance = () => {
  return axios.create({
    baseURL: import.meta.env.VITE_OAUTH_GATEWAY_URL,
  });
};

export const instance = createInstance();
