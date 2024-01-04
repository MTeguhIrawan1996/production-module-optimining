import { FileWithPath } from '@mantine/dropzone';
import { useMutation } from '@tanstack/react-query';

import axiosClient from '@/services/restapi/axiosClient';

import { AxiosRestErrorResponse } from '@/types/global';

export interface IMutationShippingMonitoringValues {
  bargeHeavyEquipmentId: string | null;
  tugboatHeavyEquipmentId: string | null;
  palkaOpenDate?: Date | null;
  palkaOpenTime: string;
  palkaCloseDate?: Date | null;
  palkaCloseTime: string;
  destinationTypeId: string | null;
  factoryId: string | null;
  vesselOpenDate?: Date | null;
  vesselOpenTime: string;
  vesselCloseDate?: Date | null;
  vesselCloseTime: string;
  desc: string;
  photo: FileWithPath[] | null;
}
interface ICreateShippingMonitoringResponse {
  message: string;
}

type IPropsRequest = {
  data: {
    name: keyof IMutationShippingMonitoringValues;
    value: string | FileWithPath[] | Date | null;
  }[];
};

const CreateShippingMonitoring = async ({ data }: IPropsRequest) => {
  const axiosAuth = axiosClient();
  const bodyFormData = new FormData();
  const exclude = ['tonByRitage', 'ritageDuration'];
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

  const response = await axiosAuth.post(`/monitoring-bargings`, bodyFormData);
  return response?.data;
};

export const useCreateShippingMonitoring = ({
  onError,
  onSuccess,
}: {
  onSuccess?: (success: ICreateShippingMonitoringResponse) => void;
  onError?: (
    error: AxiosRestErrorResponse<IMutationShippingMonitoringValues>
  ) => unknown;
}) => {
  return useMutation<
    ICreateShippingMonitoringResponse,
    AxiosRestErrorResponse<IMutationShippingMonitoringValues>,
    IPropsRequest
  >({
    mutationFn: async (value) => {
      const data = await CreateShippingMonitoring(value);
      return data;
    },
    onError: onError,
    onSuccess: onSuccess,
  });
};
