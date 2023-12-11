import { FileWithPath } from '@mantine/dropzone';
import { useMutation } from '@tanstack/react-query';

import axiosClient from '@/services/restapi/axiosClient';

import { AxiosRestErrorResponse, ICreateFileProps } from '@/types/global';

interface IUploadFileRitageOreResponse {
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

const UploadFileRitageOre = async ({ data, utcOffset }: IPropsRequest) => {
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

  const response = await axiosAuth.post(`/ore-ritages/file`, bodyFormData);
  return response?.data;
};

export const useUploadFileRitageOre = ({
  onError,
  onSuccess,
}: {
  onSuccess?: (success: IUploadFileRitageOreResponse) => void;
  onError?: (error: AxiosRestErrorResponse<ICreateFileProps>) => unknown;
}) => {
  return useMutation<
    IUploadFileRitageOreResponse,
    AxiosRestErrorResponse<ICreateFileProps>,
    IPropsRequest
  >({
    mutationFn: async (value) => {
      const data = await UploadFileRitageOre(value);
      return data;
    },
    onError: onError,
    onSuccess: onSuccess,
  });
};
