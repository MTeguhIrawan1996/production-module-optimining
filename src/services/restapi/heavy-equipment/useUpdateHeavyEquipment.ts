import { FileWithPath } from '@mantine/dropzone';
import { useMutation } from '@tanstack/react-query';

import axiosClient from '@/services/restapi/axiosClient';

import { AxiosRestErrorResponse } from '@/types/global';

export interface IUpdateHeavyEquipmentValuesQuery {
  id: string;
  brandId: string;
  typeId: string;
  modelId: string;
  spec: string;
  createdYear: string;
  photos: FileWithPath[] | null;
  deletedPhotoIds: string[];
}

export interface IUpdateHeavyEquipmentResponse {
  data: Omit<IUpdateHeavyEquipmentValuesQuery, 'deletedPhotoIds'>;
  message: string;
}

const CreateUser = async ({
  modelId,
  createdYear,
  photos,
  spec,
  deletedPhotoIds,
  id,
}: Omit<IUpdateHeavyEquipmentValuesQuery, 'brandId' | 'typeId'>) => {
  const axiosAuth = axiosClient();
  const bodyFormData = new FormData();
  bodyFormData.append('id', id);
  if (photos) {
    photos.forEach((image) => {
      bodyFormData.append('photos[]', image);
    });
  }
  if (deletedPhotoIds) {
    deletedPhotoIds.forEach((deltedId) => {
      bodyFormData.append('deletedPhotoIds[]', deltedId);
    });
  }
  bodyFormData.append('modelId', modelId);
  bodyFormData.append('createdYear', createdYear);
  bodyFormData.append('spec', spec);

  const response = await axiosAuth.patch(
    `/heavy-equipment-references/${id}`,
    bodyFormData
  );
  return response?.data;
};

export const useUpdateHeavyEquipment = ({
  onError,
  onSuccess,
}: {
  onSuccess?: (success: IUpdateHeavyEquipmentResponse) => void;
  onError?: (
    error: AxiosRestErrorResponse<
      Omit<
        IUpdateHeavyEquipmentValuesQuery,
        'brandId' | 'typeId' | 'id' | 'deletedPhotoIds'
      >
    >
  ) => unknown;
}) => {
  return useMutation<
    IUpdateHeavyEquipmentResponse,
    AxiosRestErrorResponse<
      Omit<
        IUpdateHeavyEquipmentValuesQuery,
        'brandId' | 'typeId' | 'id' | 'deletedPhotoIds'
      >
    >,
    Omit<IUpdateHeavyEquipmentValuesQuery, 'brandId' | 'typeId'>
  >({
    mutationFn: async ({
      modelId,
      createdYear,
      photos,
      deletedPhotoIds,
      id,
      spec,
    }) => {
      const data = await CreateUser({
        modelId,
        createdYear,
        photos,
        spec,
        deletedPhotoIds,
        id,
      });
      return data;
    },
    onError: onError,
    onSuccess: onSuccess,
  });
};
