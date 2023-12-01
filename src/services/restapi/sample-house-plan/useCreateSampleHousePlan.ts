import { FileWithPath } from '@mantine/dropzone';
import { useMutation } from '@tanstack/react-query';

import axiosClient from '@/services/restapi/axiosClient';

import { AxiosRestErrorResponse } from '@/types/global';

export type IElementRhf = {
  elementId: string;
  name: string;
  value: string;
};

export interface IMutationSampleHousePlanValues {
  laboratoriumName: string;
  sampleDate?: Date | null;
  shiftId: string | null;
  sampleNumber: string;
  sampleName: string;
  sampleTypeId: string | null;
  materialId: string | null;
  subMaterialId: string | null;
  samplerId: string | null;
  gradeControlId: string | null;
  locationId: string | null;
  locationCategoryId: string | null;
  locationName: string;
  sampleEnterLabDate?: Date | null;
  sampleEnterLabTime: string;
  gradeControlElements: IElementRhf[];
  density: string;
  preparationStartDate?: Date | null;
  preparationStartTime: string;
  preparationFinishDate?: Date | null;
  preparationFinishTime: string;
  analysisStartDate?: Date | null;
  analysisStartTime: string;
  analysisFinishDate?: Date | null;
  analysisFinishTime: string;
  elements: IElementRhf[];
  photo: FileWithPath[] | null;
}

interface ICreateSampleHousePlanResponse {
  message: string;
}

type IPropsRequest = {
  data: {
    name: keyof IMutationSampleHousePlanValues;
    value: string | FileWithPath[] | IElementRhf[] | null;
  }[];
};

const CreateSampleHousePlan = async ({ data }: IPropsRequest) => {
  const axiosAuth = axiosClient();
  const bodyFormData = new FormData();
  const exclude = [''];
  data.forEach(({ name, value }) => {
    if (value) {
      if (name === 'photo') {
        (value as FileWithPath[]).forEach((image) => {
          bodyFormData.append('photo', image);
        });
      }
      if (name === 'gradeControlElements') {
        (value as IElementRhf[]).forEach((value, index: number) => {
          if (value.value !== '') {
            bodyFormData.append(
              `gradeControlElements[${index}][elementId]`,
              value.elementId
            );
            bodyFormData.append(
              `gradeControlElements[${index}][value]`,
              value.value
            );
          }
        });
      }
      if (name === 'elements') {
        (value as IElementRhf[]).forEach((value, index: number) => {
          if (value.value !== '') {
            bodyFormData.append(
              `elements[${index}][elementId]`,
              value.elementId
            );
            bodyFormData.append(`elements[${index}][value]`, value.value);
          }
        });
      }
      if (!exclude.includes(name) && typeof value === 'string') {
        if (value !== '') {
          bodyFormData.append(name, value);
        }
      }
    }
  });

  const response = await axiosAuth.post(`/house-sample-and-labs`, bodyFormData);
  return response?.data;
};

export const useCreateSampleHousePlan = ({
  onError,
  onSuccess,
}: {
  onSuccess?: (success: ICreateSampleHousePlanResponse) => void;
  onError?: (
    error: AxiosRestErrorResponse<IMutationSampleHousePlanValues>
  ) => unknown;
}) => {
  return useMutation<
    ICreateSampleHousePlanResponse,
    AxiosRestErrorResponse<IMutationSampleHousePlanValues>,
    IPropsRequest
  >({
    mutationFn: async (value) => {
      const data = await CreateSampleHousePlan(value);
      return data;
    },
    onError: onError,
    onSuccess: onSuccess,
  });
};
