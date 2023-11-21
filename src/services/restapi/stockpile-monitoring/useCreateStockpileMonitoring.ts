import { FileWithPath } from '@mantine/dropzone';
import { useMutation } from '@tanstack/react-query';

import axiosClient from '@/services/restapi/axiosClient';

import { AxiosRestErrorResponse } from '@/types/global';

export interface IMutationStockpile {
  stockpileId: string;
  domeName: string | null;
  domeId: string;
  oreSubMaterialId: string | null;
  openDate: Date | undefined | null;
  openTime: string;
  closeDate: Date | undefined | null;
  closeTime: string;
  tonSurveys: {
    date: string;
    ton: string;
  }[];
  bargingStartDate: Date | undefined | null;
  bargingStartTime: string;
  bargingFinishDate: Date | undefined | null;
  bargingFinishTime: string;
  movings: {
    startDate: Date | undefined | null;
    startTime: string;
    finishDate: Date | undefined | null;
    finishTime: string;
  }[];

  reopens: {
    openDate: Date | undefined | null;
    openTime: string;
    closeDate: Date | undefined | null;
    closeTime: string;
  }[];
  desc: string;
  samples: {
    date: Date | undefined | null;
    sampleTypeId: string | null;
    sampleNumber: string;
    elementId: string | null;
    value: string;
  }[];
  photo: FileWithPath[] | null;
}

export interface ICreateStockpileResponse {
  message: string;
}

type IPropsRequest = {
  data: {
    name: keyof IMutationStockpile;
    value: string | null | undefined | FileWithPath[];
  }[];
};

const CreateStockpileMonitoring = async ({ data }: IPropsRequest) => {
  const axiosAuth = axiosClient();
  const bodyFormData = new FormData();
  const exclude = ['domeId'];
  data.forEach(({ name, value }) => {
    if (value) {
      if (name === 'photo' && typeof value !== 'string') {
        value.forEach((image) => {
          bodyFormData.append('photos', image);
        });
      }
      if (!exclude.includes(name) && typeof value === 'string') {
        bodyFormData.append(name, value);
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
