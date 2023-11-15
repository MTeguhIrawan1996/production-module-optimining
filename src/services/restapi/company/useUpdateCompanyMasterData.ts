import { FileWithPath } from '@mantine/dropzone';
import { useMutation } from '@tanstack/react-query';

import axiosClient from '@/services/restapi/axiosClient';
import { ICompanyMutationValues } from '@/services/restapi/company/useCreateCompanyMasterData';
import { dateToString } from '@/utils/helper/dateToString';

import { AxiosRestErrorResponse } from '@/types/global';

export interface IUpdateCompanyResponse {
  message: string;
}

type IPropsRequest = {
  companyId: string;
  data: {
    name: keyof ICompanyMutationValues;
    value: string | FileWithPath[] | null;
  }[];
};

const UpdateCompany = async ({ data, companyId }: IPropsRequest) => {
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

  const response = await axiosAuth.patch(
    `/companies/${companyId}`,
    bodyFormData
  );
  return response?.data;
};

export const useUpdateCompany = ({
  onError,
  onSuccess,
}: {
  onSuccess?: (success: IUpdateCompanyResponse) => void;
  onError?: (error: AxiosRestErrorResponse<ICompanyMutationValues>) => unknown;
}) => {
  return useMutation<
    IUpdateCompanyResponse,
    AxiosRestErrorResponse<ICompanyMutationValues>,
    IPropsRequest
  >({
    mutationFn: async (value) => {
      const data = await UpdateCompany(value);
      return data;
    },
    onError: onError,
    onSuccess: onSuccess,
  });
};
