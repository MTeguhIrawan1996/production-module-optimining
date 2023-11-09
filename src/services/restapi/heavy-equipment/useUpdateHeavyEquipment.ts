import { FileWithPath } from '@mantine/dropzone';
import { useMutation } from '@tanstack/react-query';

import axiosClient from '@/services/restapi/axiosClient';

import { AxiosRestErrorResponse } from '@/types/global';

export interface IUpdateHeavyEquipmentValuesQuery {
  id: string;
  brandId: string;
  typeId: string;
  modelName: string;
  spec: string;
  modelYear: string;
  photos: FileWithPath[] | null;
  deletedPhotoIds: string[];
}

export interface IUpdateHeavyEquipmentResponse {
  data: Omit<IUpdateHeavyEquipmentValuesQuery, 'deletedPhotoIds'>;
  message: string;
}

const UpdateHeavyEquipment = async ({
  modelName,
  modelYear,
  photos,
  spec,
  deletedPhotoIds,
  id,
  typeId,
}: Omit<IUpdateHeavyEquipmentValuesQuery, 'brandId'>) => {
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
  bodyFormData.append('modelName', modelName);
  bodyFormData.append('modelYear', modelYear);
  bodyFormData.append('typeId', typeId);
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
        'brandId' | 'id' | 'deletedPhotoIds'
      >
    >
  ) => unknown;
}) => {
  return useMutation<
    IUpdateHeavyEquipmentResponse,
    AxiosRestErrorResponse<
      Omit<
        IUpdateHeavyEquipmentValuesQuery,
        'brandId' | 'id' | 'deletedPhotoIds'
      >
    >,
    Omit<IUpdateHeavyEquipmentValuesQuery, 'brandId'>
  >({
    mutationFn: async ({
      modelName,
      modelYear,
      photos,
      deletedPhotoIds,
      id,
      spec,
      typeId,
    }) => {
      const data = await UpdateHeavyEquipment({
        modelName,
        typeId,
        modelYear,
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
