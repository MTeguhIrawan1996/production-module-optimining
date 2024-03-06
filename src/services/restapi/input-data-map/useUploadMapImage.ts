import { FileWithPath } from '@mantine/dropzone';
import { useMutation } from '@tanstack/react-query';

import axiosClient from '@/services/restapi/axiosClient';

import { AxiosRestErrorResponse } from '@/types/global';

export interface IMiningMapPlanData {
  file: FileWithPath[] | null;
}

interface IMutationMiningMapPlanResponse {
  fileId: string;
}

type IPropsRequest = {
  data: IMiningMapPlanData;
};

const uploadMapImage = async ({ data }: IPropsRequest) => {
  const axiosAuth = axiosClient();
  const bodyFormData = new FormData();

  if (data?.file) {
    bodyFormData.append('file', data.file[0]);
  }

  const response = await axiosAuth.post(`/map-data/file`, bodyFormData);
  return response?.data;
};

export const useUploadMapImage = ({
  onError,
  onSuccess,
}: {
  onSuccess?: (success: IMutationMiningMapPlanResponse) => void;
  onError?: (error: AxiosRestErrorResponse<any>) => unknown;
}) => {
  return useMutation<
    IMutationMiningMapPlanResponse,
    AxiosRestErrorResponse<any>,
    IPropsRequest
  >({
    mutationFn: async (value) => {
      const data = await uploadMapImage(value);
      return data;
    },
    onError: onError,
    onSuccess: onSuccess,
  });
};
