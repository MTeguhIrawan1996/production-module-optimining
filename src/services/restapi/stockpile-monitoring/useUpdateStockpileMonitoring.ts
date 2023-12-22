import { FileWithPath } from '@mantine/dropzone';
import { useMutation } from '@tanstack/react-query';

import axiosClient from '@/services/restapi/axiosClient';

import { AxiosRestErrorResponse, IElementRhf } from '@/types/global';

export interface IMutationStockpileStepOne {
  stockpileId: string | null;
  handbookId: string;
  domeId: string | null;
  oreSubMaterialId: string | null;
  openDate?: Date | null;
  openTime: string;
  closeDate?: Date | null;
  closeTime: string;
  tonSurveys: {
    date?: Date | null;
    ton: string | number;
  }[];
  tonByRitage: string | number | null;
  bargingStartDate?: Date | null;
  bargingStartTime: string;
  bargingFinishDate?: Date | null;
  bargingFinishTime: string;
  movings: {
    startDate?: Date | null;
    startTime: string;
    finishDate?: Date | null;
    finishTime: string;
  }[];
  reopens: {
    openDate?: Date | null;
    openTime: string;
    closeDate?: Date | null;
    closeTime: string;
  }[];
  desc: string;
  photo: FileWithPath[] | null;
}

export interface IMutationStockpileStepTwo {
  samples: {
    date?: Date | null;
    sampleTypeId: string | null;
    sampleNumber: string;
    elements: IElementRhf[];
  }[];
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
    value: string | null | FileWithPath[] | IElementRhf[];
  }[];
  deletePhoto: boolean | null;
};

const UpdateStockpileMonitoring = async ({ data, id }: IPropsRequest) => {
  const axiosAuth = axiosClient();
  const bodyFormData = new FormData();
  const exclude = ['handbookId', 'stockpileId'];
  data.forEach(({ name, value }) => {
    if (value) {
      if (name === 'photo' && typeof value !== 'string') {
        (value as FileWithPath[]).forEach((image) => {
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

  const response = await axiosAuth.patch(
    `/house-sample-and-labs/${id}`,
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
