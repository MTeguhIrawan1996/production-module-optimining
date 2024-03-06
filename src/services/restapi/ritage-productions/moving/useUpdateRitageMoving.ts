import { FileWithPath } from '@mantine/dropzone';
import { useMutation } from '@tanstack/react-query';

import axiosClient from '@/services/restapi/axiosClient';
import { IMutationRitageMoving } from '@/services/restapi/ritage-productions/moving/useCreateRitageMoving';

import { AxiosRestErrorResponse } from '@/types/global';

interface IUpdateRitageMovingResponse {
  message: string;
}

type IPropsRequest = {
  id: string;
  data: {
    name: keyof IMutationRitageMoving;
    value: string | FileWithPath[] | boolean | null;
  }[];
  deletedPhotoIds: string[];
};

const UpdateRitageMoving = async ({
  data,
  deletedPhotoIds,
  id,
}: IPropsRequest) => {
  const axiosAuth = axiosClient();
  const bodyFormData = new FormData();
  const exclude = ['tonByRitage', 'ritageDuration'];
  bodyFormData.append('id', id);
  if (deletedPhotoIds) {
    deletedPhotoIds.forEach((deletedId) => {
      bodyFormData.append('deletedPhotoIds[]', deletedId);
    });
  }
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

  const response = await axiosAuth.patch(`/moving-ritages/${id}`, bodyFormData);
  return response?.data;
};

export const useUpdateRitageMoving = ({
  onError,
  onSuccess,
}: {
  onSuccess?: (success: IUpdateRitageMovingResponse) => void;
  onError?: (error: AxiosRestErrorResponse<IMutationRitageMoving>) => unknown;
}) => {
  return useMutation<
    IUpdateRitageMovingResponse,
    AxiosRestErrorResponse<IMutationRitageMoving>,
    IPropsRequest
  >({
    mutationFn: async (value) => {
      const data = await UpdateRitageMoving(value);
      return data;
    },
    onError: onError,
    onSuccess: onSuccess,
  });
};
