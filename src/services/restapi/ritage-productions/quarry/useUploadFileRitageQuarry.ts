import { FileWithPath } from '@mantine/dropzone';
import { useMutation } from '@tanstack/react-query';

import axiosClient from '@/services/restapi/axiosClient';

import { AxiosRestErrorResponse, ICreateFileProps } from '@/types/global';

interface IUploadFileRitageQuarryResponse {
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

const UploadFileRitageQuarry = async ({ data, utcOffset }: IPropsRequest) => {
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

  const response = await axiosAuth.post(`/quarry-ritages/file`, bodyFormData);
  return response?.data;
};

export const useUploadFileRitageQuarry = ({
  onError,
  onSuccess,
}: {
  onSuccess?: (success: IUploadFileRitageQuarryResponse) => void;
  onError?: (error: AxiosRestErrorResponse<ICreateFileProps>) => unknown;
}) => {
  return useMutation<
    IUploadFileRitageQuarryResponse,
    AxiosRestErrorResponse<ICreateFileProps>,
    IPropsRequest
  >({
    mutationFn: async (value) => {
      const data = await UploadFileRitageQuarry(value);
      return data;
    },
    onError: onError,
    onSuccess: onSuccess,
  });
};
