import { FileWithPath } from '@mantine/dropzone';
import { useMutation } from '@tanstack/react-query';

import axiosClient from '@/services/restapi/axiosClient';

import { AxiosRestErrorResponse } from '@/types/global';

export interface ICreateHeavyEquipmentValues {
  brandId: string;
  typeId: string;
  modelId: string;
  spec: string;
  createdYear: string;
  photos: FileWithPath[] | string | null;
}

export interface ICreateHeavyEquipmentResponse {
  data: ICreateHeavyEquipmentValues;
  message: string;
}

const CreateHeavyEquipment = async ({
  modelId,
  createdYear,
  photos,
  spec,
}: Omit<ICreateHeavyEquipmentValues, 'brandId' | 'typeId'>) => {
  const axiosAuth = axiosClient();
  const bodyFormData = new FormData();
  if (photos && typeof photos !== 'string') {
    photos.forEach((image) => {
      bodyFormData.append('photos[]', image);
    });
  }
  bodyFormData.append('modelId', modelId);
  bodyFormData.append('createdYear', createdYear);
  bodyFormData.append('spec', spec);

  const response = await axiosAuth.post(
    `/heavy-equipment-references`,
    bodyFormData
  );
  return response?.data;
};

export const useCreateHeavyEquipment = ({
  onError,
  onSuccess,
}: {
  onSuccess?: (success: ICreateHeavyEquipmentResponse) => void;
  onError?: (
    error: AxiosRestErrorResponse<
      Omit<ICreateHeavyEquipmentValues, 'brandId' | 'typeId'>
    >
  ) => unknown;
}) => {
  return useMutation<
    ICreateHeavyEquipmentResponse,
    AxiosRestErrorResponse<
      Omit<ICreateHeavyEquipmentValues, 'brandId' | 'typeId'>
    >,
    Omit<ICreateHeavyEquipmentValues, 'brandId' | 'typeId'>
  >({
    mutationFn: async ({ modelId, createdYear, photos, spec }) => {
      const data = await CreateHeavyEquipment({
        modelId,
        createdYear,
        photos,
        spec,
      });
      return data;
    },
    onError: onError,
    onSuccess: onSuccess,
  });
};
