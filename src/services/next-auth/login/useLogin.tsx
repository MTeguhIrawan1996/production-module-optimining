import { useMutation } from '@tanstack/react-query';
import { signIn, SignInResponse } from 'next-auth/react';

export interface ILogin {
  usernameOrEmail: string;
  password: string;
}

const ILogin = async ({ usernameOrEmail, password }: ILogin) => {
  try {
    const response = await signIn('credentials', {
      redirect: false,
      usernameOrEmail: usernameOrEmail,
      password: password,
      callbackUrl: '/',
    });
    if (!response?.ok) {
      return Promise.reject(response);
    }
    return response;
  } catch (err: any) {
    return err;
  }
};

export const useLogin = ({
  onError,
  onSuccess,
}: {
  onSuccess?: (success: any) => void;
  onError?: (error: any) => unknown;
}) => {
  return useMutation<SignInResponse | undefined, any, ILogin>({
    mutationFn: async (body) => {
      const data = await ILogin({
        usernameOrEmail: body.usernameOrEmail,
        password: body.password,
      });
      return data;
    },
    onError: onError,
    onSuccess: onSuccess,
  });
};
