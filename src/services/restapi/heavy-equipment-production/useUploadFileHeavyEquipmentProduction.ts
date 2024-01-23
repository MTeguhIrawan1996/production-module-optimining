import { FileWithPath } from '@mantine/dropzone';
import { useMutation } from '@tanstack/react-query';

import axiosClient from '@/services/restapi/axiosClient';

import { AxiosRestErrorResponse, ICreateFileProps } from '@/types/global';

interface IUploadFileHeavyEquipmentProductionResponse {
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

const UploadFileHeavyEquipmentProduction = async ({
  data,
  utcOffset,
}: IPropsRequest) => {
  const axiosAuth = axiosClient();
  const bodyFormData = new FormData();

  bodyFormData.append('utcOffset', utcOffset);

  data.forEach(({ name, value }) => {
    if (value && value.length > 0) {
      if (name === 'file') {
        (value as FileWithPath[]).forEach((file) => {
          bodyFormData.append('file', file);
        });
      }
    }
  });

  const response = await axiosAuth.post(
    `/heavy-equipment-datas/file`,
    bodyFormData
  );
  return response?.data;
};

export const useUploadFileHeavyEquipmentProduction = ({
  onError,
  onSuccess,
}: {
  onSuccess?: (success: IUploadFileHeavyEquipmentProductionResponse) => void;
  onError?: (error: AxiosRestErrorResponse<ICreateFileProps>) => unknown;
}) => {
  return useMutation<
    IUploadFileHeavyEquipmentProductionResponse,
    AxiosRestErrorResponse<ICreateFileProps>,
    IPropsRequest
  >({
    mutationFn: async (value) => {
      const data = await UploadFileHeavyEquipmentProduction(value);
      return data;
    },
    onError: onError,
    onSuccess: onSuccess,
  });
};
