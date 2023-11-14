import { FileWithPath } from '@mantine/dropzone';
import { useMutation } from '@tanstack/react-query';

import axiosClient from '@/services/restapi/axiosClient';
import { dateToString } from '@/utils/helper/dateToString';

import { AxiosRestErrorResponse } from '@/types/global';

export interface ICreateHeavyEquipmentCompanyValues {
  hullNumber: string;
  engineNumber: string;
  chassisNumber: string;
  brandId: string;
  typeId: string;
  referenceId: string;
  classId: string;
  eligibilityStatusId: string;
  vehicleNumber: string;
  specification: string;
  createdYear: string;
  startDate: Date | undefined | string | null;
  endDate: Date | undefined | string | null;
  isStill: boolean;
  photos: FileWithPath[] | null;
  vehicleNumberPhoto: FileWithPath[] | null;
}

export interface ICreateHeavyEquipmentCompanyResponse {
  message: string;
}

type IPropsRequest = {
  companyId: string;
  data: {
    name: keyof ICreateHeavyEquipmentCompanyValues;
    value: string | FileWithPath[] | boolean | undefined | null;
  }[];
};

const CreateHeavyEquipmentCompany = async ({
  data,
  companyId,
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

  const response = await axiosAuth.post(
    `/companies/${companyId}/heavy-equipments`,
    bodyFormData
  );
  return response?.data;
};

export const useCreateHeavyEquipmentCompany = ({
  onError,
  onSuccess,
}: {
  onSuccess?: (success: ICreateHeavyEquipmentCompanyResponse) => void;
  onError?: (
    error: AxiosRestErrorResponse<ICreateHeavyEquipmentCompanyValues>
  ) => unknown;
}) => {
  return useMutation<
    ICreateHeavyEquipmentCompanyResponse,
    AxiosRestErrorResponse<ICreateHeavyEquipmentCompanyValues>,
    IPropsRequest
  >({
    mutationFn: async (value) => {
      const data = await CreateHeavyEquipmentCompany(value);
      return data;
    },
    onError: onError,
    onSuccess: onSuccess,
  });
};
