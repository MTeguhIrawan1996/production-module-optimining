import { useMutation } from '@tanstack/react-query';

import axiosClient from '@/services/restapi/axiosClient';

import { AxiosRestErrorResponse } from '@/types/global';

export interface IUpdateUser {
  id: string;
  photo: File | string | null;
  name: string;
  username: string;
  email: string;
  phoneNumber: string | null;
  roleId: string;
}

export interface IUpdateUserResponse {
  data: IUpdateUser;
  message: string;
}

const UpdateUser = async ({
  name,
  email,
  roleId,
  photo,
  phoneNumber,
  username,
  id,
}: IUpdateUser) => {
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
  bodyFormData.append('roleId', roleId);
  bodyFormData.append('id', id);

  const response = await axiosAuth.patch(`/users/${id}`, bodyFormData);
  return response?.data;
};

export const useUpdateUser = ({
  onError,
  onSuccess,
}: {
  onSuccess?: (success: IUpdateUserResponse) => void;
  onError?: (error: AxiosRestErrorResponse<Omit<IUpdateUser, 'id'>>) => unknown;
}) => {
  return useMutation<
    IUpdateUserResponse,
    AxiosRestErrorResponse<Omit<IUpdateUser, 'id'>>,
    IUpdateUser
  >({
    mutationFn: async ({
      id,
      name,
      email,
      phoneNumber,
      photo,
      roleId,
      username,
    }) => {
      const data = await UpdateUser({
        id,
        name,
        username,
        phoneNumber,
        email,
        roleId,
        photo,
      });
      return data;
    },
    onError: onError,
    onSuccess: onSuccess,
  });
};
