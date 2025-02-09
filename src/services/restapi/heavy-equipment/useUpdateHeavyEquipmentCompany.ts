import { FileWithPath } from '@mantine/dropzone';
import { useMutation } from '@tanstack/react-query';

import axiosClient from '@/services/restapi/axiosClient';
import { ICreateHeavyEquipmentCompanyValues } from '@/services/restapi/heavy-equipment/useCreateHeavyEquipmentCompany';
import { dateToString } from '@/utils/helper/dateToString';

import { AxiosRestErrorResponse } from '@/types/global';

export interface IUpdateHeavyEquipmentCompanyResponse {
  message: string;
}

type IPropsRequest = {
  companyId: string;
  heavyEquipmentId: string;
  companyHeavyEquipmentId: string;
  data: {
    name: keyof ICreateHeavyEquipmentCompanyValues;
    value: string | FileWithPath[] | boolean | undefined | null;
  }[];
  deletedPhotoIds: string[];
  deletedVehicleNumberPhoto: boolean | null;
};

const UpdateHeavyEquipmentCompany = async ({
  data,
  companyId,
  heavyEquipmentId,
  companyHeavyEquipmentId,
  deletedPhotoIds,
  deletedVehicleNumberPhoto,
}: IPropsRequest) => {
  const axiosAuth = axiosClient();
  const bodyFormData = new FormData();
  const exclude = [
    'brandId',
    'typeId',
    'photos',
    'vehicleNumberPhoto',
    'startDate',
    'endDate',
    'isStill',
    'specification',
  ];
  bodyFormData.append('id', companyHeavyEquipmentId);
  bodyFormData.append('heavyEquipmentId', heavyEquipmentId);
  if (deletedVehicleNumberPhoto) {
    bodyFormData.append('deletedVehicleNumberPhoto', 'true');
  }
  if (deletedPhotoIds) {
    deletedPhotoIds.forEach((deletedId) => {
      bodyFormData.append('deletedPhotoIds[]', deletedId);
    });
  }

  data.forEach(({ name, value }) => {
    if (name === 'isStill') {
      bodyFormData.append('isStill', String(value));
    }
    if (value) {
      if (name === 'photos' && Array.isArray(value)) {
        value.forEach((image) => {
          bodyFormData.append('photos[]', image);
        });
      }
      if (name === 'vehicleNumberPhoto' && Array.isArray(value)) {
        value.forEach((image) => {
          bodyFormData.append('vehicleNumberPhoto', image);
        });
      }
      if (name === 'startDate') {
        const startDate = dateToString(value as string);
        if (startDate) bodyFormData.append('startDate', startDate);
      }
      if (name === 'endDate') {
        const endDate = dateToString(value as string);
        if (endDate) bodyFormData.append('endDate', endDate);
      }
      if (!exclude.includes(name) && typeof value === 'string') {
        bodyFormData.append(name, value);
      }
    }
  });

  const response = await axiosAuth.patch(
    `/companies/${companyId}/heavy-equipments/${companyHeavyEquipmentId}`,
    bodyFormData
  );
  return response?.data;
};

export const useUpdateHeavyEquipmentCompany = ({
  onError,
  onSuccess,
}: {
  onSuccess?: (success: IUpdateHeavyEquipmentCompanyResponse) => void;
  onError?: (
    error: AxiosRestErrorResponse<ICreateHeavyEquipmentCompanyValues>
  ) => unknown;
}) => {
  return useMutation<
    IUpdateHeavyEquipmentCompanyResponse,
    AxiosRestErrorResponse<ICreateHeavyEquipmentCompanyValues>,
    IPropsRequest
  >({
    mutationFn: async (value) => {
      const data = await UpdateHeavyEquipmentCompany(value);
      return data;
    },
    onError: onError,
    onSuccess: onSuccess,
  });
};
