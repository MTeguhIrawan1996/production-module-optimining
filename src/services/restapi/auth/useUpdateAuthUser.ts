import { useMutation } from '@tanstack/react-query';

import axiosClient from '@/services/restapi/axiosClient';

import { AxiosRestErrorResponse } from '@/types/global';

export interface IUpdateAuthUser {
  photo: File | string | null;
  name: string;
  username: string;
  email: string;
  phoneNumber: string | null;
}

export interface IUpdateAuthUserResponse {
  data: IUpdateAuthUser;
  message: string;
}

const UpdateAuthUser = async ({
  name,
  email,
  photo,
  phoneNumber,
  username,
}: IUpdateAuthUser) => {
  const axiosAuth = axiosClient();
  const bodyFormData = new FormData();
  const serverFile = typeof photo === 'string';

  if (photo && !serverFile) {
    bodyFormData.append('photo', photo);
  }
  if (!photo) {
    bodyFormData.append('deletedPhoto', 'true');
  }
  bodyFormData.append('name', name);
  bodyFormData.append('email', email);
  bodyFormData.append('username', username);
  if (phoneNumber) {
    bodyFormData.append('phoneNumber', phoneNumber);
  }

  const response = await axiosAuth.patch(`/auth/profile`, bodyFormData);
  return response?.data;
};

export const useUpdateAuthUser = ({
  onError,
  onSuccess,
}: {
  onSuccess?: (success: IUpdateAuthUserResponse) => void;
  onError?: (error: AxiosRestErrorResponse<IUpdateAuthUser>) => unknown;
}) => {
  return useMutation<
    IUpdateAuthUserResponse,
    AxiosRestErrorResponse<IUpdateAuthUser>,
    IUpdateAuthUser
  >({
    mutationFn: async ({ name, email, phoneNumber, photo, username }) => {
      const data = await UpdateAuthUser({
        name,
        username,
        phoneNumber,
        email,
        photo,
      });
      return data;
    },
    onError: onError,
    onSuccess: onSuccess,
  });
};
