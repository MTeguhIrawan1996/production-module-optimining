import { FileWithPath } from '@mantine/dropzone';
import { useMutation } from '@tanstack/react-query';

import axiosClient from '@/services/restapi/axiosClient';
import {
  IMutationShippingMonitoringValues,
  IShippingMonitoringNameProps,
  IShippingMonitoringValueProps,
} from '@/services/restapi/shipping-monitoring/useCreateShippingMonitoring';

import { AxiosRestErrorResponse } from '@/types/global';

interface IUpdateShippingMonitoringResponse {
  message: string;
}
type IPropsRequest = {
  id: string;
  data: {
    name: IShippingMonitoringNameProps;
    value: IShippingMonitoringValueProps;
  }[];
  deletePhoto: boolean | null;
};

const UpdateShippingMonitoring = async ({
  id,
  data,
  deletePhoto,
}: IPropsRequest) => {
  const axiosAuth = axiosClient();
  const bodyFormData = new FormData();
  const exclude = [''];
  bodyFormData.append('id', id);
  if (deletePhoto) {
    bodyFormData.append('deletePhoto', 'true');
  }
  data.forEach(({ name, value }) => {
    if (value) {
      if (name === 'photo') {
        (value as FileWithPath[]).forEach((image) => {
          bodyFormData.append('photo', image);
        });
      }
      if (!exclude.includes(name) && typeof value === 'string') {
        if (value !== '') {
          bodyFormData.append(name, value);
        }
      }
    }
  });

  const response = await axiosAuth.patch(
    `/monitoring-bargings/${id}`,
    bodyFormData
  );
  return response?.data;
};

export const useUpdateShippingMonitoring = ({
  onError,
  onSuccess,
}: {
  onSuccess?: (success: IUpdateShippingMonitoringResponse) => void;
  onError?: (
    error: AxiosRestErrorResponse<IMutationShippingMonitoringValues>
  ) => unknown;
}) => {
  return useMutation<
    IUpdateShippingMonitoringResponse,
    AxiosRestErrorResponse<IMutationShippingMonitoringValues>,
    IPropsRequest
  >({
    mutationFn: async (value) => {
      const data = await UpdateShippingMonitoring(value);
      return data;
    },
    onError: onError,
    onSuccess: onSuccess,
  });
};
