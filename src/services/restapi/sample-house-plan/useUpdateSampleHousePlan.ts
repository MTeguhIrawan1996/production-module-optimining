import { FileWithPath } from '@mantine/dropzone';
import { useMutation } from '@tanstack/react-query';

import axiosClient from '@/services/restapi/axiosClient';
import {
  IElementRhf,
  IMutationSampleHousePlanValues,
} from '@/services/restapi/sample-house-plan/useCreateSampleHousePlan';

import { AxiosRestErrorResponse } from '@/types/global';

interface IUpdateSampleHousePlanResponse {
  message: string;
}

type IPropsRequest = {
  id: string;
  data: {
    name: keyof IMutationSampleHousePlanValues;
    value: string | FileWithPath[] | IElementRhf[] | null;
  }[];
  deletePhoto: boolean | null;
};

const UpdateSampleHousePlan = async ({
  data,
  deletePhoto,
  id,
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
      if (name === 'gradeControlElements') {
        (value as IElementRhf[]).forEach((value, index: number) => {
          bodyFormData.append(
            `gradeControlElements[${index}][elementId]`,
            value.elementId
          );
          bodyFormData.append(
            `gradeControlElements[${index}][value]`,
            value.value
          );
        });
      }
      if (name === 'elements') {
        (value as IElementRhf[]).forEach((value, index: number) => {
          bodyFormData.append(`elements[${index}][elementId]`, value.elementId);
          bodyFormData.append(`elements[${index}][value]`, value.value);
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
    `/house-sample-and-labs/${id}`,
    bodyFormData
  );
  return response?.data;
};

export const useUpdateSampleHousePlan = ({
  onError,
  onSuccess,
}: {
  onSuccess?: (success: IUpdateSampleHousePlanResponse) => void;
  onError?: (
    error: AxiosRestErrorResponse<IMutationSampleHousePlanValues>
  ) => unknown;
}) => {
  return useMutation<
    IUpdateSampleHousePlanResponse,
    AxiosRestErrorResponse<IMutationSampleHousePlanValues>,
    IPropsRequest
  >({
    mutationFn: async (value) => {
      const data = await UpdateSampleHousePlan(value);
      return data;
    },
    onError: onError,
    onSuccess: onSuccess,
  });
};
