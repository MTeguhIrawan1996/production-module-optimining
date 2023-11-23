import { FileWithPath } from '@mantine/dropzone';
import { useMutation } from '@tanstack/react-query';

import axiosClient from '@/services/restapi/axiosClient';

import { AxiosRestErrorResponse } from '@/types/global';

export interface ICreateUserValues {
  name: string;
  photo: FileWithPath[] | null;
  roleId: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
}

export interface ICreateUserResponse {
  data: ICreateUserValues;
  message: string;
}

const CreateUser = async ({
  name,
  email,
  password,
  confirmPassword,
  roleId,
  photo,
  phoneNumber,
  username,
}: ICreateUserValues) => {
  const axiosAuth = axiosClient();
  const bodyFormData = new FormData();

  if (photo && photo?.length > 0) {
    bodyFormData.append('photo', photo[0]);
  }
  bodyFormData.append('name', name);
  bodyFormData.append('email', email);
  bodyFormData.append('password', password);
  bodyFormData.append('confirmPassword', confirmPassword);
  bodyFormData.append('username', username);
  bodyFormData.append('phoneNumber', phoneNumber);
  bodyFormData.append('roleId', roleId);

  const response = await axiosAuth.post(`/users`, bodyFormData);
  return response?.data;
};

export const useCreateUser = ({
  onError,
  onSuccess,
}: {
  onSuccess?: (success: ICreateUserResponse) => void;
  onError?: (error: AxiosRestErrorResponse<ICreateUserValues>) => unknown;
}) => {
  return useMutation<
    ICreateUserResponse,
    AxiosRestErrorResponse<ICreateUserValues>,
    ICreateUserValues
  >({
    mutationFn: async ({
      name,
      email,
      password,
      confirmPassword,
      phoneNumber,
      photo,
      roleId,
      username,
    }) => {
      const data = await CreateUser({
        name,
        username,
        phoneNumber,
        email,
        password,
        confirmPassword,
        roleId,
        photo,
      });
      return data;
    },
    onError: onError,
    onSuccess: onSuccess,
  });
};
