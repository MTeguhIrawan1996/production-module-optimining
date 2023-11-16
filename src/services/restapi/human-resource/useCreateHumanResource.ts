import { FileWithPath } from '@mantine/dropzone';
import { useMutation } from '@tanstack/react-query';

import axiosClient from '@/services/restapi/axiosClient';
import { dateToString } from '@/utils/helper/dateToString';

import { AxiosRestErrorResponse } from '@/types/global';

export interface ICreateHumanResourceValues {
  name: string;
  alias: string;
  isWni: string;
  identityTypeId: string;
  identityNumber: string;
  pob: string;
  dob: Date | undefined | string | null;
  gender: string;
  religionId: string;
  educationDegree: string;
  marriageStatusId: string;
  provinceId: string | null;
  regencyId: string | null;
  subdistrictId: string | null;
  villageId: string | null;
  address: string;
  isAddressSameWithDomicile: string;
  domicileProvinceId: string;
  domicileRegencyId: string;
  domicileSubdistrictId: string;
  domicileVillageId: string | null;
  domicileAddress: string;
  phoneNumber: string;
  email: string;
  bloodType: string;
  resus: string;
  photo: FileWithPath[] | null;
  identityPhoto: FileWithPath[] | null;
}

type INameValue = {
  name: string;
  value: string | null | undefined | FileWithPath[];
};

export interface ICreateHumanResourceResponse {
  data: ICreateHumanResourceValues;
  message: string;
}

const CreateHumanResource = async (props: INameValue[]) => {
  const axiosAuth = axiosClient();
  const bodyFormData = new FormData();
  const exclude = [
    'domicileProvinceId',
    'domicileRegencyId',
    'domicileSubdistrictId',
    'provinceId',
    'regencyId',
    'subdistrictId',
  ];

  props.forEach(({ name, value }) => {
    if (!exclude.includes(name) && value) {
      if (name === 'photo' && typeof value !== 'string') {
        value.forEach((image) => {
          bodyFormData.append('photo', image);
        });
        return;
      }
      if (name === 'identityPhoto' && typeof value !== 'string') {
        value.forEach((image) => {
          bodyFormData.append('identityPhoto', image);
        });
        return;
      }
      if (name === 'dob') {
        const date = dateToString(value as string);
        if (date) bodyFormData.append('dob', date);
        return;
      }
      if (
        name !== 'identityPhoto' &&
        name !== 'photo' &&
        typeof value === 'string'
      ) {
        bodyFormData.append(`${name}`, value);
        return;
      }
    }
  });

  const response = await axiosAuth.post(`/human-resources`, bodyFormData);
  return response?.data;
};

export const useCreateHumanResource = ({
  onError,
  onSuccess,
}: {
  onSuccess?: (success: ICreateHumanResourceResponse) => void;
  onError?: (
    error: AxiosRestErrorResponse<ICreateHumanResourceValues>
  ) => unknown;
}) => {
  return useMutation<
    ICreateHumanResourceResponse,
    AxiosRestErrorResponse<ICreateHumanResourceValues>,
    INameValue[]
  >({
    mutationFn: async (props) => {
      const data = await CreateHumanResource(props);
      return data;
    },
    onError: onError,
    onSuccess: onSuccess,
  });
};
