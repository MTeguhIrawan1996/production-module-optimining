import { FileWithPath } from '@mantine/dropzone';
import { useMutation } from '@tanstack/react-query';

import axiosClient from '@/services/restapi/axiosClient';
import { ICreateHumanResourceValues } from '@/services/restapi/human-resource/useCreateHumanResource';
import { dateToString } from '@/utils/helper/dateToString';

import { AxiosRestErrorResponse } from '@/types/global';

export interface IUpdateHumanResourceValues extends ICreateHumanResourceValues {
  id: string;
}

type INameValue = {
  id: string;
  data: {
    name: string;
    value: string | null | undefined | FileWithPath[];
  }[];
  deletedPhoto: boolean | null;
  deletedIdentityPhoto: boolean | null;
};

export interface IUpdateHumanResourceResponse {
  data: IUpdateHumanResourceValues;
  message: string;
}

const UpdateHumanResource = async (props: INameValue) => {
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
  bodyFormData.append('id', props.id);
  if (props.deletedPhoto) {
    bodyFormData.append('deletePhoto', 'true');
  }
  if (props.deletedIdentityPhoto) {
    bodyFormData.append('deleteIdentityPhoto', 'true');
  }
  props.data.forEach(({ name, value }) => {
    if (!exclude.includes(name) && value) {
      if (name === 'photo' && typeof value !== 'string') {
        value.forEach((image) => {
          bodyFormData.append('photo', image);
        });
      }
      if (name === 'identityPhoto' && typeof value !== 'string') {
        value.forEach((image) => {
          bodyFormData.append('identityPhoto', image);
        });
      }
      if (name === 'dob') {
        const date = dateToString(value as string);
        if (date) bodyFormData.append('dob', date);
      }
      if (
        name !== 'identityPhoto' &&
        name !== 'photo' &&
        typeof value === 'string'
      ) {
        bodyFormData.append(`${name}`, value);
      }
    }
  });

  const response = await axiosAuth.patch(
    `/human-resources/${props.id}`,
    bodyFormData
  );
  return response?.data;
};

export const useUpdateHumanResource = ({
  onError,
  onSuccess,
}: {
  onSuccess?: (success: IUpdateHumanResourceResponse) => void;
  onError?: (
    error: AxiosRestErrorResponse<Omit<IUpdateHumanResourceValues, 'id'>>
  ) => unknown;
}) => {
  return useMutation<
    IUpdateHumanResourceResponse,
    AxiosRestErrorResponse<Omit<IUpdateHumanResourceValues, 'id'>>,
    INameValue
  >({
    mutationFn: async (props) => {
      const data = await UpdateHumanResource(props);
      return data;
    },
    onError: onError,
    onSuccess: onSuccess,
  });
};
