import { FileWithPath } from '@mantine/dropzone';
import { useMutation } from '@tanstack/react-query';

import { IEmployee } from '@/services/graphql/query/master-data-company/useReadOneCompanyHumanResource';
import axiosClient from '@/services/restapi/axiosClient';
import { ICreateHumanResourceValues } from '@/services/restapi/human-resource/useCreateHumanResource';
import { dateToString } from '@/utils/helper/dateToString';

import { AxiosRestErrorResponse } from '@/types/global';

export interface ICreateCompanyHumanResource
  extends ICreateHumanResourceValues {
  id: string;
}

interface ICreateCompanyHumanResourceData extends IEmployee {
  humanResource: ICreateCompanyHumanResource;
}

type IRequestCompanyHumanResources = {
  companyId: string;
  data: {
    name: string;
    value: string | null | undefined | FileWithPath[];
  }[];
};

export interface ICreateCompanyHumanResourceResponse {
  data: ICreateCompanyHumanResourceData;
  message: string;
}

const CreateCompanyHumanResource = async (
  props: IRequestCompanyHumanResources
) => {
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

  const response = await axiosAuth.post(
    `/companies/${props.companyId}/employees`,
    bodyFormData
  );
  return response?.data;
};

export const useCreateCompanyHumanResource = ({
  onError,
  onSuccess,
}: {
  onSuccess?: (success: ICreateCompanyHumanResourceResponse) => void;
  onError?: (
    error: AxiosRestErrorResponse<Omit<ICreateCompanyHumanResource, 'id'>>
  ) => unknown;
}) => {
  return useMutation<
    ICreateCompanyHumanResourceResponse,
    AxiosRestErrorResponse<Omit<ICreateCompanyHumanResource, 'id'>>,
    IRequestCompanyHumanResources
  >({
    mutationFn: async (props) => {
      const data = await CreateCompanyHumanResource(props);
      return data;
    },
    onError: onError,
    onSuccess: onSuccess,
  });
};
