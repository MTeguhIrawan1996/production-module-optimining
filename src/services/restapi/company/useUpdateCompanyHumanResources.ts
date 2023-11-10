import { FileWithPath } from '@mantine/dropzone';
import { useMutation } from '@tanstack/react-query';

import { IEmployee } from '@/services/graphql/query/master-data-company/useReadOneCompanyHumanResource';
import axiosClient from '@/services/restapi/axiosClient';
import { ICreateHumanResourceValues } from '@/services/restapi/human-resource/useCreateHumanResource';
import { dateToString } from '@/utils/helper/dateToString';

import { AxiosRestErrorResponse } from '@/types/global';

export interface IUpdateCompanyHumanResourceValues
  extends ICreateHumanResourceValues {
  id: string;
}

type INameValue = {
  companyId: string;
  employeId: string;
  data: {
    name: string;
    value: string | null | undefined | FileWithPath[];
  }[];
  deletedPhoto: boolean | null;
  deletedIdentityPhoto: boolean | null;
};

interface ICreateCompanyHumanResourceData extends IEmployee {
  humanResource: IUpdateCompanyHumanResourceValues;
}

export interface IUpdateCompanyHumanResourceResponse {
  data: ICreateCompanyHumanResourceData;
  message: string;
}

const UpdateCompanyHumanResource = async (props: INameValue) => {
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
  bodyFormData.append('humanResourceId', props.employeId);
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
        bodyFormData.append('dob', date);
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
    `/companies/${props.companyId}/employees/${props.employeId}`,
    bodyFormData
  );
  return response?.data;
};

export const useUpdateCompanyHumanResource = ({
  onError,
  onSuccess,
}: {
  onSuccess?: (success: IUpdateCompanyHumanResourceResponse) => void;
  onError?: (
    error: AxiosRestErrorResponse<Omit<IUpdateCompanyHumanResourceValues, 'id'>>
  ) => unknown;
}) => {
  return useMutation<
    IUpdateCompanyHumanResourceResponse,
    AxiosRestErrorResponse<Omit<IUpdateCompanyHumanResourceValues, 'id'>>,
    INameValue
  >({
    mutationFn: async (props) => {
      const data = await UpdateCompanyHumanResource(props);
      return data;
    },
    onError: onError,
    onSuccess: onSuccess,
  });
};
