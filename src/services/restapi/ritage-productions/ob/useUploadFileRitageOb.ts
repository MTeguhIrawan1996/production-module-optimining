import { FileWithPath } from '@mantine/dropzone';
import { useMutation } from '@tanstack/react-query';

import axiosClient from '@/services/restapi/axiosClient';

import { AxiosRestErrorResponse, ICreateFileProps } from '@/types/global';

interface IUploadFileRitageObResponse {
  message: string;
  data: {
    id: string;
  };
}

type IPropsRequest = {
  utcOffset: string;
  data: {
    name: keyof ICreateFileProps;
    value: FileWithPath[] | null;
  }[];
};

const UploadFileRitageOb = async ({ data, utcOffset }: IPropsRequest) => {
  const axiosAuth = axiosClient();
  const bodyFormData = new FormData();

  bodyFormData.append('utcOffset', utcOffset);

  data.forEach(({ name, value }) => {
    if (value && value.length > 0) {
      if (name === 'file') {
        (value as FileWithPath[]).forEach((image) => {
          bodyFormData.append('file', image);
        });
      }
    }
  });

  const response = await axiosAuth.post(
    `/overburden-ritages/file`,
    bodyFormData
  );
  return response?.data;
};

export const useUploadFileRitageOb = ({
  onError,
  onSuccess,
}: {
  onSuccess?: (success: IUploadFileRitageObResponse) => void;
  onError?: (error: AxiosRestErrorResponse<ICreateFileProps>) => unknown;
}) => {
  return useMutation<
    IUploadFileRitageObResponse,
    AxiosRestErrorResponse<ICreateFileProps>,
    IPropsRequest
  >({
    mutationFn: async (value) => {
      const data = await UploadFileRitageOb(value);
      return data;
    },
    onError: onError,
    onSuccess: onSuccess,
  });
};
