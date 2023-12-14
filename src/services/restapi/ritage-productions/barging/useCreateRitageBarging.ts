import { FileWithPath } from '@mantine/dropzone';
import { useMutation } from '@tanstack/react-query';

import axiosClient from '@/services/restapi/axiosClient';

import { AxiosRestErrorResponse } from '@/types/global';

export interface IMutationRitageBarging {
  isRitageProblematic: boolean;
  date?: Date | null;
  checkerFromId: string | null;
  checkerFromPosition: string;
  checkerToId: string | null;
  checkerToPosition: string;
  shiftId: string | null;
  companyHeavyEquipmentId: string | null;
  companyHeavyEquipmentChangeId: string | null;
  materialId: string | null;
  subMaterialId: string | null;
  fromTime: string;
  arriveTime: string;
  ritageDuration: string;
  weatherId: string | null;
  stockpileName: string;
  domeId: string | null;
  bargingId: string | null;
  bulkSamplingDensity: string | number;
  bucketVolume: string | number;
  tonByRitage: string;
  sampleNumber: string;
  desc: string;
  photos: FileWithPath[] | null;
}
interface ICreateRitageBargingResponse {
  message: string;
}

type IPropsRequest = {
  data: {
    name: keyof IMutationRitageBarging;
    value: string | FileWithPath[] | boolean | null;
  }[];
};

const CreateRitageBarging = async ({ data }: IPropsRequest) => {
  const axiosAuth = axiosClient();
  const bodyFormData = new FormData();
  const exclude = ['tonByRitage', 'ritageDuration', 'stockpileName'];
  data.forEach(({ name, value }) => {
    if (name === 'isRitageProblematic') {
      bodyFormData.append('isRitageProblematic', String(value));
    }
    if (value) {
      if (name === 'photos') {
        (value as FileWithPath[]).forEach((image) => {
          bodyFormData.append('photos[]', image);
        });
      }
      if (!exclude.includes(name) && typeof value === 'string') {
        if (value !== '') {
          bodyFormData.append(name, value);
        }
      }
    }
  });

  const response = await axiosAuth.post(`/barging-ritages`, bodyFormData);
  return response?.data;
};

export const useCreateRitageBarging = ({
  onError,
  onSuccess,
}: {
  onSuccess?: (success: ICreateRitageBargingResponse) => void;
  onError?: (error: AxiosRestErrorResponse<IMutationRitageBarging>) => unknown;
}) => {
  return useMutation<
    ICreateRitageBargingResponse,
    AxiosRestErrorResponse<IMutationRitageBarging>,
    IPropsRequest
  >({
    mutationFn: async (value) => {
      const data = await CreateRitageBarging(value);
      return data;
    },
    onError: onError,
    onSuccess: onSuccess,
  });
};
