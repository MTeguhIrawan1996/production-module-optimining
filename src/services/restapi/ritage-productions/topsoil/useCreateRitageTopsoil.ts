import { FileWithPath } from '@mantine/dropzone';
import { useMutation } from '@tanstack/react-query';

import axiosClient from '@/services/restapi/axiosClient';

import { AxiosRestErrorResponse } from '@/types/global';

export interface IMutationRitageTopsoil {
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
  weatherId: string | null;
  fromTime: string;
  arriveTime: string;
  ritageDuration: string;
  fromPitId: string | null;
  block: string;
  fromFrontId: string | null;
  fromGridId: string | null;
  fromSequenceId: string | null;
  fromElevationId: string | null;
  toLocationCategoryId: string | null;
  toLocationId: string | null;
  bulkSamplingDensity: string | number;
  bucketVolume: string | number;
  tonByRitage: string;
  desc: string;
  photos: FileWithPath[] | null;
}
interface ICreateRitageTopsoilResponse {
  message: string;
}

type IPropsRequest = {
  data: {
    name: keyof IMutationRitageTopsoil;
    value: string | FileWithPath[] | null;
  }[];
};

const CreateRitageTopsoil = async ({ data }: IPropsRequest) => {
  const axiosAuth = axiosClient();
  const bodyFormData = new FormData();
  const exclude = ['tonByRitage', 'ritageDuration'];
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

  const response = await axiosAuth.post(`/topsoil-ritages`, bodyFormData);
  return response?.data;
};

export const useCreateRitageTopsoil = ({
  onError,
  onSuccess,
}: {
  onSuccess?: (success: ICreateRitageTopsoilResponse) => void;
  onError?: (error: AxiosRestErrorResponse<IMutationRitageTopsoil>) => unknown;
}) => {
  return useMutation<
    ICreateRitageTopsoilResponse,
    AxiosRestErrorResponse<IMutationRitageTopsoil>,
    IPropsRequest
  >({
    mutationFn: async (value) => {
      const data = await CreateRitageTopsoil(value);
      return data;
    },
    onError: onError,
    onSuccess: onSuccess,
  });
};
