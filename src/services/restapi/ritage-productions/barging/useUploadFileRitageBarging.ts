import { FileWithPath } from '@mantine/dropzone';
import { useMutation } from '@tanstack/react-query';

import axiosClient from '@/services/restapi/axiosClient';

import { AxiosRestErrorResponse, ICreateFileProps } from '@/types/global';

interface IUploadFileRitageBargingResponse {
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

const UploadFileRitageBarging = async ({ data, utcOffset }: IPropsRequest) => {
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

  const response = await axiosAuth.post(`/barging-ritages/file`, bodyFormData);
  return response?.data;
};

export const useUploadFileRitageBarging = ({
  onError,
  onSuccess,
}: {
  onSuccess?: (success: IUploadFileRitageBargingResponse) => void;
  onError?: (error: AxiosRestErrorResponse<ICreateFileProps>) => unknown;
}) => {
  return useMutation<
    IUploadFileRitageBargingResponse,
    AxiosRestErrorResponse<ICreateFileProps>,
    IPropsRequest
  >({
    mutationFn: async (value) => {
      const data = await UploadFileRitageBarging(value);
      return data;
    },
    onError: onError,
    onSuccess: onSuccess,
  });
};
