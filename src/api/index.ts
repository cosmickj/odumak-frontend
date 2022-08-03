import axios from 'axios';

const createInstance = () => {
  return axios.create({
    baseURL: import.meta.env.VITE_ADMIN_SERVER,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });
};

export const instance = createInstance();
