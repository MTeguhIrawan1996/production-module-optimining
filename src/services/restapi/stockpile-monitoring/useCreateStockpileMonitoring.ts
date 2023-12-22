import { FileWithPath } from '@mantine/dropzone';
import { useMutation } from '@tanstack/react-query';

import axiosClient from '@/services/restapi/axiosClient';

import { AxiosRestErrorResponse } from '@/types/global';

export interface IMutationStockpileStepOne {
  stockpileId: string | null;
  handbookId: string;
  domeId: string | null;
  oreSubMaterialId: string | null;
  openDate?: Date | null;
  openTime: string;
  closeDate?: Date | null;
  closeTime: string;
  desc: string;
  photo: FileWithPath[] | null;
}

export interface IMutationStockpileStepTwo {
  // tonSurveys: {
  //   date: string;
  //   ton: string;
  // }[];
  // bargingStartDate?: Date | null;
  // bargingStartTime: string;
  // bargingFinishDate?: Date | null;
  // bargingFinishTime: string;
  // movings: {
  //   startDate?: Date | null;
  //   startTime: string;
  //   finishDate?: Date | null;
  //   finishTime: string;
  // }[];
  // reopens: {
  //   openDate?: Date | null;
  //   openTime: string;
  //   closeDate?: Date | null;
  //   closeTime: string;
  // }[];
  samples: {
    date?: Date | null;
    sampleTypeId: string | null;
    sampleNumber: string;
    elements: {
      elementId: string | null;
      value: string;
    }[];
  }[];
}

export type IMutationStockpile = IMutationStockpileStepOne &
  IMutationStockpileStepTwo;

export interface ICreateStockpileResponse {
  message: string;
}

type IPropsRequest = {
  data: {
    name: keyof IMutationStockpile;
    value: string | null | FileWithPath[];
  }[];
};

const CreateStockpileMonitoring = async ({ data }: IPropsRequest) => {
  const axiosAuth = axiosClient();
  const bodyFormData = new FormData();
  const exclude = ['handbookId', 'stockpileId'];
  data.forEach(({ name, value }) => {
    if (value) {
      if (name === 'photo' && typeof value !== 'string') {
        value.forEach((image) => {
          bodyFormData.append('photos', image);
        });
      }
      if (!exclude.includes(name) && typeof value === 'string') {
        if (value !== '') {
          bodyFormData.append(name, value);
        }
      }
    }
  });

  const response = await axiosAuth.post(`/heavy-equipments`, bodyFormData);
  return response?.data;
};

export const useCreateStockpileMonitoring = ({
  onError,
  onSuccess,
}: {
  onSuccess?: (success: ICreateStockpileResponse) => void;
  onError?: (error: AxiosRestErrorResponse<IMutationStockpile>) => unknown;
}) => {
  return useMutation<
    ICreateStockpileResponse,
    AxiosRestErrorResponse<IMutationStockpile>,
    IPropsRequest
  >({
    mutationFn: async (value) => {
      const data = await CreateStockpileMonitoring(value);
      return data;
    },
    onError: onError,
    onSuccess: onSuccess,
  });
};
