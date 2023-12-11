import { FileWithPath } from '@mantine/dropzone';
import { useMutation } from '@tanstack/react-query';

import axiosClient from '@/services/restapi/axiosClient';

import { AxiosRestErrorResponse } from '@/types/global';

export interface IMutationRitageOb {
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
  block: string;
  weatherId: string | null;
  fromPitId: string | null;
  fromFrontId: string | null;
  fromGridId: string | null;
  fromSequenceId: string | null;
  fromElevationId: string | null;
  disposalId: string | null;
  bulkSamplingDensity: string | number;
  bucketVolume: string | number;
  tonByRitage: string;
  sampleNumber: string;
  desc: string;
  photos: FileWithPath[] | null;
}
interface ICreateRitageObResponse {
  message: string;
}

type IPropsRequest = {
  data: {
    name: keyof IMutationRitageOb;
    value: string | FileWithPath[] | null;
  }[];
};

const CreateRitageOb = async ({ data }: IPropsRequest) => {
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

  const response = await axiosAuth.post(`/overburden-ritages`, bodyFormData);
  return response?.data;
};

export const useCreateRitageOb = ({
  onError,
  onSuccess,
}: {
  onSuccess?: (success: ICreateRitageObResponse) => void;
  onError?: (error: AxiosRestErrorResponse<IMutationRitageOb>) => unknown;
}) => {
  return useMutation<
    ICreateRitageObResponse,
    AxiosRestErrorResponse<IMutationRitageOb>,
    IPropsRequest
  >({
    mutationFn: async (value) => {
      const data = await CreateRitageOb(value);
      return data;
    },
    onError: onError,
    onSuccess: onSuccess,
  });
};
