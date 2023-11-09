import { FileWithPath } from '@mantine/dropzone';
import { useMutation } from '@tanstack/react-query';

import axiosClient from '@/services/restapi/axiosClient';

import { AxiosRestErrorResponse } from '@/types/global';

export interface ICreateHeavyEquipmentValues {
  brandId: string;
  typeId: string;
  modelName: string;
  spec: string;
  modelYear: string;
  photos: FileWithPath[] | string | null;
}

export interface ICreateHeavyEquipmentResponse {
  data: ICreateHeavyEquipmentValues;
  message: string;
}

const CreateHeavyEquipment = async ({
  modelName,
  modelYear,
  photos,
  spec,
  typeId,
}: Omit<ICreateHeavyEquipmentValues, 'brandId'>) => {
  const axiosAuth = axiosClient();
  const bodyFormData = new FormData();
  if (photos && typeof photos !== 'string') {
    photos.forEach((image) => {
      bodyFormData.append('photos[]', image);
    });
  }
  bodyFormData.append('modelName', modelName);
  bodyFormData.append('modelYear', modelYear);
  bodyFormData.append('typeId', typeId);
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
    error: AxiosRestErrorResponse<Omit<ICreateHeavyEquipmentValues, 'brandId'>>
  ) => unknown;
}) => {
  return useMutation<
    ICreateHeavyEquipmentResponse,
    AxiosRestErrorResponse<Omit<ICreateHeavyEquipmentValues, 'brandId'>>,
    Omit<ICreateHeavyEquipmentValues, 'brandId'>
  >({
    mutationFn: async ({ modelName, modelYear, photos, spec, typeId }) => {
      const data = await CreateHeavyEquipment({
        modelName,
        modelYear,
        photos,
        spec,
        typeId,
      });
      return data;
    },
    onError: onError,
    onSuccess: onSuccess,
  });
};
