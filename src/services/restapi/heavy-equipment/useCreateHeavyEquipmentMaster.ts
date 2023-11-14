import { FileWithPath } from '@mantine/dropzone';
import { useMutation } from '@tanstack/react-query';

import axiosClient from '@/services/restapi/axiosClient';

import { AxiosRestErrorResponse } from '@/types/global';

export interface ICreateHeavyEquipmentMasterValues {
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

export interface ICreateHeavyEquipmentMasterResponse {
  data: ICreateHeavyEquipmentMasterValues;
  message: string;
}

type IPropsRequest = {
  data: {
    name: keyof ICreateHeavyEquipmentMasterValues;
    value: string | null | FileWithPath[];
  }[];
};

const CreateHeavyEquipmentMaster = async ({ data }: IPropsRequest) => {
  const axiosAuth = axiosClient();
  const bodyFormData = new FormData();
  const exclude = [
    'brandId',
    'typeId',
    'photos',
    'vehicleNumberPhoto',
    'specification',
  ];
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

  const response = await axiosAuth.post(`/heavy-equipments`, bodyFormData);
  return response?.data;
};

export const useCreateHeavyEquipmentMaster = ({
  onError,
  onSuccess,
}: {
  onSuccess?: (success: ICreateHeavyEquipmentMasterResponse) => void;
  onError?: (
    error: AxiosRestErrorResponse<ICreateHeavyEquipmentMasterValues>
  ) => unknown;
}) => {
  return useMutation<
    ICreateHeavyEquipmentMasterResponse,
    AxiosRestErrorResponse<ICreateHeavyEquipmentMasterValues>,
    IPropsRequest
  >({
    mutationFn: async (value) => {
      const data = await CreateHeavyEquipmentMaster(value);
      return data;
    },
    onError: onError,
    onSuccess: onSuccess,
  });
};
