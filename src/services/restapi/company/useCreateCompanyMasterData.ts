import { FileWithPath } from '@mantine/dropzone';
import { useMutation } from '@tanstack/react-query';

import axiosClient from '@/services/restapi/axiosClient';
import { dateToString } from '@/utils/helper/dateToString';

import { AxiosRestErrorResponse } from '@/types/global';

export interface ICompanyMutationValues {
  name: string;
  alias: string;
  typeId: string | null;
  businessTypeId: string | null;
  provinceId: string | null;
  regencyId: string | null;
  subdistrictId: string | null;
  villageId: string | null;
  address: string;
  email1: string;
  phoneNumber1: string;
  email2: string;
  phoneNumber2: string;
  faxNumber: string;
  code: string;
  nib: string;
  logo: FileWithPath[] | null;
  permissionTypeId: string | null;
  permissionTypeNumber: string;
  permissionTypeDate?: Date | null;
  permissionTypeDocument: FileWithPath[] | null;
}

export interface ICreateCompanyResponse {
  message: string;
}

type IPropsRequest = {
  data: {
    name: keyof ICompanyMutationValues;
    value: string | FileWithPath[] | null;
  }[];
};

const CreateCompany = async ({ data }: IPropsRequest) => {
  const axiosAuth = axiosClient();
  const bodyFormData = new FormData();
  const exclude = ['provinceId', 'regencyId', 'subdistrictId'];
  data.forEach(({ name, value }) => {
    if (value) {
      if (name === 'logo' && Array.isArray(value)) {
        value.forEach((image) => {
          bodyFormData.append('logo', image);
        });
      }
      if (name === 'permissionTypeDocument' && Array.isArray(value)) {
        value.forEach((file) => {
          bodyFormData.append('permissionTypeDocument', file);
        });
      }
      if (name === 'permissionTypeDate') {
        const date = dateToString(value as string);
        if (date) bodyFormData.append('permissionTypeDate', date);
      }
      if (!exclude.includes(name) && typeof value === 'string') {
        bodyFormData.append(name, value);
      }
    }
  });

  const response = await axiosAuth.post(`/companies`, bodyFormData);
  return response?.data;
};

export const useCreateCompany = ({
  onError,
  onSuccess,
}: {
  onSuccess?: (success: ICreateCompanyResponse) => void;
  onError?: (error: AxiosRestErrorResponse<ICompanyMutationValues>) => unknown;
}) => {
  return useMutation<
    ICreateCompanyResponse,
    AxiosRestErrorResponse<ICompanyMutationValues>,
    IPropsRequest
  >({
    mutationFn: async (value) => {
      const data = await CreateCompany(value);
      return data;
    },
    onError: onError,
    onSuccess: onSuccess,
  });
};
