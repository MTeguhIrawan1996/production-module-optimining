import { FileWithPath } from '@mantine/dropzone';
import { useMutation } from '@tanstack/react-query';

import axiosClient from '@/services/restapi/axiosClient';
import { dateToString } from '@/utils/helper/dateToString';

import { AxiosRestErrorResponse, IElementRhf } from '@/types/global';

type tonBySurveys = {
  date?: Date | null;
  ton: string | number;
};
type movings = {
  startDate?: Date | null;
  startTime: string;
  finishDate?: Date | null;
  finishTime: string;
};
type reopens = {
  openDate?: Date | null;
  openTime: string;
  closeDate?: Date | null;
  closeTime: string;
};
type samples = {
  date?: Date | null;
  sampleTypeId: string | null;
  isCreatedAfterDetermine: boolean;
  sampleNumber: string;
  elements: IElementRhf[];
};

export interface IMutationStockpileStepOne {
  stockpileId: string | null;
  handbookId: string;
  domeId: string | null;
  oreSubMaterialId: string | null;
  openDate?: Date | null;
  openTime: string;
  closeDate?: Date | null;
  closeTime: string;
  tonSurveys: tonBySurveys[];
  tonByRitage: string | number | null;
  bargingStartDate?: Date | null;
  bargingStartTime: string;
  bargingFinishDate?: Date | null;
  bargingFinishTime: string;
  movings: movings[];
  reopens: reopens[];
  desc: string;
  photo: FileWithPath[] | null;
}

export interface IMutationStockpileStepTwo {
  samples: samples[];
}

export type IMutationStockpile = IMutationStockpileStepOne &
  IMutationStockpileStepTwo;

export interface IUpdateStockpileResponse {
  message: string;
}

type IPropsRequest = {
  id: string;
  data: {
    name: keyof IMutationStockpile;
    value:
      | string
      | null
      | FileWithPath[]
      | IElementRhf[]
      | tonBySurveys[]
      | movings[]
      | samples[]
      | reopens[];
  }[];
};

const UpdateStockpileMonitoring = async ({ data, id }: IPropsRequest) => {
  const axiosAuth = axiosClient();
  const bodyFormData = new FormData();
  const exclude = ['handbookId', 'stockpileId', 'tonByRitage'];
  bodyFormData.append('id', id);
  data.forEach(({ name, value }) => {
    if (value) {
      if (name === 'tonSurveys') {
        (value as tonBySurveys[]).forEach((value, index: number) => {
          const date = dateToString(value.date ?? null);
          if (date) bodyFormData.append(`tonSurveys[${index}][date]`, date);
          bodyFormData.append(`tonSurveys[${index}][ton]`, `${value.ton}`);
        });
      }
      if (name === 'movings') {
        (value as movings[]).forEach((value, index: number) => {
          const startDate = dateToString(value.startDate ?? null);
          const finishDate = dateToString(value.finishDate ?? null);
          if (startDate)
            bodyFormData.append(`movings[${index}][startDate]`, startDate);
          bodyFormData.append(
            `movings[${index}][startTime]`,
            `${value.startTime}`
          );
          if (finishDate)
            bodyFormData.append(`movings[${index}][finishDate]`, finishDate);
          bodyFormData.append(
            `movings[${index}][finishTime]`,
            `${value.finishTime}`
          );
        });
      }
      if (name === 'reopens') {
        (value as reopens[]).forEach((value, index: number) => {
          const openDate = dateToString(value.openDate ?? null);
          const closeDate = dateToString(value.closeDate ?? null);
          if (openDate)
            bodyFormData.append(`reopens[${index}][openDate]`, openDate);
          bodyFormData.append(
            `reopens[${index}][startTime]`,
            `${value.openTime}`
          );
          if (closeDate)
            bodyFormData.append(`reopens[${index}][closeDate]`, closeDate);
          bodyFormData.append(
            `reopens[${index}][closeDate]`,
            `${value.closeTime}`
          );
        });
      }
      if (name === 'samples') {
        (value as samples[]).forEach((value, index: number) => {
          const date = dateToString(value.date ?? null);
          if (date) bodyFormData.append(`samples[${index}][date]`, date);
          bodyFormData.append(
            `samples[${index}][sampleTypeId]`,
            value.sampleTypeId ?? ''
          );
          bodyFormData.append(
            `samples[${index}][sampleNumber]`,
            value.sampleNumber ?? ''
          );
          value.elements.forEach((obj, i) => {
            bodyFormData.append(
              `samples[${index}][elements][${i}][elementId]`,
              obj.elementId
            );
            bodyFormData.append(
              `samples[${index}][elements][${i}][value]`,
              `${obj.value ?? ''}`
            );
          });
        });
      }
      if (name === 'photo' && typeof value !== 'string') {
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
    `/monitoring-stockpiles/${id}`,
    bodyFormData
  );
  return response?.data;
};

export const useUpdateStockpileMonitoring = ({
  onError,
  onSuccess,
}: {
  onSuccess?: (success: IUpdateStockpileResponse) => void;
  onError?: (error: AxiosRestErrorResponse<IMutationStockpile>) => unknown;
}) => {
  return useMutation<
    IUpdateStockpileResponse,
    AxiosRestErrorResponse<IMutationStockpile>,
    IPropsRequest
  >({
    mutationFn: async (value) => {
      const data = await UpdateStockpileMonitoring(value);
      return data;
    },
    onError: onError,
    onSuccess: onSuccess,
  });
};
