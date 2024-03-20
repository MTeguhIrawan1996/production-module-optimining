import { FileWithPath } from '@mantine/dropzone';
import { useMutation } from '@tanstack/react-query';

import axiosClient from '@/services/restapi/axiosClient';
import { IMutationRitageBarging } from '@/services/restapi/ritage-productions/barging/useCreateRitageBarging';

import { AxiosRestErrorResponse } from '@/types/global';

interface IUpdateRitageBargingResponse {
  message: string;
}

type IPropsRequest = {
  id: string;
  data: {
    name: keyof IMutationRitageBarging;
    value: string | FileWithPath[] | boolean | null;
  }[];
  deletedPhotoIds: string[];
};

const UpdateRitageBarging = async ({
  data,
  deletedPhotoIds,
  id,
}: IPropsRequest) => {
  const axiosAuth = axiosClient();
  const bodyFormData = new FormData();
  const exclude = [
    'tonByRitage',
    'ritageDuration',
    'stockpileName',
    'material',
    'subMaterial',
  ];
  bodyFormData.append('id', id);
  if (deletedPhotoIds) {
    deletedPhotoIds.forEach((deletedId) => {
      bodyFormData.append('deletedPhotoIds[]', deletedId);
    });
  }
  data.forEach(({ name, value }) => {
    if (name === 'closeDome') {
      bodyFormData.append('closeDome', String(value));
    }
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

  const response = await axiosAuth.patch(
    `/barging-ritages/${id}`,
    bodyFormData
  );
  return response?.data;
};

export const useUpdateRitageBarging = ({
  onError,
  onSuccess,
}: {
  onSuccess?: (success: IUpdateRitageBargingResponse) => void;
  onError?: (error: AxiosRestErrorResponse<IMutationRitageBarging>) => unknown;
}) => {
  return useMutation<
    IUpdateRitageBargingResponse,
    AxiosRestErrorResponse<IMutationRitageBarging>,
    IPropsRequest
  >({
    mutationFn: async (value) => {
      const data = await UpdateRitageBarging(value);
      return data;
    },
    onError: onError,
    onSuccess: onSuccess,
  });
};
