import { FileWithPath } from '@mantine/dropzone';
import { useMutation } from '@tanstack/react-query';

import axiosClient from '@/services/restapi/axiosClient';

import { AxiosRestErrorResponse } from '@/types/global';

export interface IMutationRitageQuarry {
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
  locationCategoryId: string | null;
  toLocationId: string | null;
  bulkSamplingDensity: string | number;
  bucketVolume: string | number;
  tonByRitage: string;
  desc: string;
  photos: FileWithPath[] | null;
}
interface ICreateRitageQuarryResponse {
  message: string;
}

type IPropsRequest = {
  data: {
    name: keyof IMutationRitageQuarry;
    value: string | FileWithPath[] | null;
  }[];
};

const CreateRitageQuarry = async ({ data }: IPropsRequest) => {
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

  const response = await axiosAuth.post(`/quarry-ritages`, bodyFormData);
  return response?.data;
};

export const useCreateRitageQuarry = ({
  onError,
  onSuccess,
}: {
  onSuccess?: (success: ICreateRitageQuarryResponse) => void;
  onError?: (error: AxiosRestErrorResponse<IMutationRitageQuarry>) => unknown;
}) => {
  return useMutation<
    ICreateRitageQuarryResponse,
    AxiosRestErrorResponse<IMutationRitageQuarry>,
    IPropsRequest
  >({
    mutationFn: async (value) => {
      const data = await CreateRitageQuarry(value);
      return data;
    },
    onError: onError,
    onSuccess: onSuccess,
  });
};
