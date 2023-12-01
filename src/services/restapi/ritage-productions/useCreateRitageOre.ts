import { FileWithPath } from '@mantine/dropzone';
import { useMutation } from '@tanstack/react-query';

import axiosClient from '@/services/restapi/axiosClient';

import { AxiosRestErrorResponse } from '@/types/global';

export interface IMutationRitageOre {
  date: Date | null;
  checkerFromId: string | null;
  checkerFromPosition: string;
  checkerToId: string | null;
  checkerToPosition: string;
  shiftId: string | null;
  companyHeavyEquipmentId: string | null;
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
  fromLevel: string;
  toLevel: string;
  stockpileId: string | null;
  domeId: string | null;
  closeDome: boolean;
  bulkSamplingDensity: string | number;
  bucketVolume: string | number;
  tonByRitage: string;
  sampleNumber: string;
  desc: string;
  photos: FileWithPath[] | null;
}
interface ICreateRitageOreResponse {
  message: string;
}

type IPropsRequest = {
  data: {
    name: keyof IMutationRitageOre;
    value: string | FileWithPath[] | boolean | null;
  }[];
};

const CreateRitageOre = async ({ data }: IPropsRequest) => {
  const axiosAuth = axiosClient();
  const bodyFormData = new FormData();
  const exclude = [''];
  data.forEach(({ name, value }) => {
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

  const response = await axiosAuth.post(`/ore-ritages`, bodyFormData);
  return response?.data;
};

export const useCreateRitageOre = ({
  onError,
  onSuccess,
}: {
  onSuccess?: (success: ICreateRitageOreResponse) => void;
  onError?: (error: AxiosRestErrorResponse<IMutationRitageOre>) => unknown;
}) => {
  return useMutation<
    ICreateRitageOreResponse,
    AxiosRestErrorResponse<IMutationRitageOre>,
    IPropsRequest
  >({
    mutationFn: async (value) => {
      const data = await CreateRitageOre(value);
      return data;
    },
    onError: onError,
    onSuccess: onSuccess,
  });
};
