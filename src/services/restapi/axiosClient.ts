import { notifications } from '@mantine/notifications';
import axios, { AxiosRequestConfig } from 'axios';
import { getSession, signOut } from 'next-auth/react';

import { AxiosRestErrorResponse } from '@/types/global';

const baseURL = process.env.NEXT_PUBLIC_REST_API_URL;

const axiosClient = () => {
  const defaultOptions = {
    baseURL,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  const instance = axios.create(defaultOptions);

  instance.interceptors.request.use(
    async (request: AxiosRequestConfig<any>) => {
      const session = await getSession();
      if (session) {
        (request.headers as any)[
          'authorization'
        ] = `Bearer ${session?.user.login.accessToken.token}`;
      }
      (request.headers as any)['Accept-Language'] = `id`;
      return request;
    }
  );

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosRestErrorResponse<any>) => {
      if (
        error.response?.data.statusCode === 404 ||
        error.response?.data.statusCode === 500
      ) {
        notifications.show({
          color: 'red',
          title: 'Gagal',
          message: 'Terjadi kesalahan',
        });
      }
      if (error.response?.data.statusCode === 401) {
        signOut({ redirect: true, callbackUrl: '/' });
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export default axiosClient;
