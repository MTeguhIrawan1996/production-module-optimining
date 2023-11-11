import { FileWithPath } from '@mantine/dropzone';
import { useMutation } from '@tanstack/react-query';

import axiosClient from '@/services/restapi/axiosClient';

import { AxiosRestErrorResponse } from '@/types/global';

export interface IUpdateHeavyEquipmentMasterValues {
  id: string;
  engineNumber: string;
  chassisNumber: string;
  brandId: string;
  typeId: string;
  referenceId: string;
  classId: string;
  eligibilityStatusId: string;
  specification: string;
  vehicleNumber: string;
  createdYear: string;
  photos: FileWithPath[] | string | null;
  vehicleNumberPhoto: FileWithPath[] | string | null;
}

export interface IUpdateHeavyEquipmentMasterResponse {
  data: IUpdateHeavyEquipmentMasterValues;
  message: string;
}

type IPropsRequest = {
  id: string;
  data: {
    name: keyof IUpdateHeavyEquipmentMasterValues;
    value: string | null | FileWithPath[];
  }[];
  deletedPhotoIds: string[];
};

const UpdateHeavyEquipmentMaster = async ({
  data,
  id,
  deletedPhotoIds,
}: IPropsRequest) => {
  const axiosAuth = axiosClient();
  const bodyFormData = new FormData();
  const exclude = ['brandId', 'typeId', 'photos', 'vehicleNumberPhoto'];

  bodyFormData.append('id', id);
  if (deletedPhotoIds) {
    deletedPhotoIds.forEach((deletedId) => {
      bodyFormData.append('deletedPhotoIds[]', deletedId);
    });
  }
  data.forEach(({ name, value }) => {
    if (value) {
      if (name === 'photos' && typeof value !== 'string') {
        value.forEach((image) => {
          bodyFormData.append('photos[]', image);
        });
      }
      if (name === 'vehicleNumberPhoto' && typeof value !== 'string') {
        value.forEach((image) => {
          bodyFormData.append('vehicleNumberPhoto', image);
        });
      }
      if (!exclude.includes(name) && typeof value === 'string') {
        bodyFormData.append(name, value);
      }
    }
  });

  const response = await axiosAuth.patch(
    `/heavy-equipments/${id}`,
    bodyFormData
  );
  return response?.data;
};

export const useUpdateHeavyEquipmentMaster = ({
  onError,
  onSuccess,
}: {
  onSuccess?: (success: IUpdateHeavyEquipmentMasterResponse) => void;
  onError?: (
    error: AxiosRestErrorResponse<Omit<IUpdateHeavyEquipmentMasterValues, 'id'>>
  ) => unknown;
}) => {
  return useMutation<
    IUpdateHeavyEquipmentMasterResponse,
    AxiosRestErrorResponse<Omit<IUpdateHeavyEquipmentMasterValues, 'id'>>,
    IPropsRequest
  >({
    mutationFn: async (value) => {
      const data = await UpdateHeavyEquipmentMaster(value);
      return data;
    },
    onError: onError,
    onSuccess: onSuccess,
  });
};
