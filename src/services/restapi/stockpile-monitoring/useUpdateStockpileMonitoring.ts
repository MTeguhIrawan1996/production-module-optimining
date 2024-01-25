import { FileWithPath } from '@mantine/dropzone';
import { useMutation } from '@tanstack/react-query';

import axiosClient from '@/services/restapi/axiosClient';
import { dateToString } from '@/utils/helper/dateToString';

import { AxiosRestErrorResponse, IElementRhf } from '@/types/global';

type tonBySurveys = {
  date?: Date | null;
  ton: string | number;
};
type bargings = {
  startDate?: Date | null;
  startTime: string;
  finishDate?: Date | null;
  finishTime: string;
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
  bargings: bargings[];
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
  deletePhoto: boolean | null;
};

const UpdateStockpileMonitoring = async ({
  data,
  id,
  deletePhoto,
}: IPropsRequest) => {
  const axiosAuth = axiosClient();
  const bodyFormData = new FormData();
  const exclude: (keyof IMutationStockpile)[] = [
    'handbookId',
    'stockpileId',
    'tonByRitage',
    'domeId',
    'openDate',
    'openTime',
    'closeDate',
    'closeTime',
  ];
  bodyFormData.append('id', id);
  if (deletePhoto) {
    bodyFormData.append('deletePhoto', 'true');
  }
  data.forEach(({ name, value }) => {
    if (value) {
      if (name === 'tonSurveys') {
        (value as tonBySurveys[]).forEach((value, index: number) => {
          const date = dateToString(value.date ?? null);
          if (date) bodyFormData.append(`tonSurveys[${index}][date]`, date);
          bodyFormData.append(`tonSurveys[${index}][ton]`, `${value.ton}`);
        });
      }
      if (name === 'samples') {
        (value as samples[]).forEach((value, index: number) => {
          bodyFormData.append(
            `samples[${index}][sampleNumber]`,
            value.sampleNumber ?? ''
          );
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
