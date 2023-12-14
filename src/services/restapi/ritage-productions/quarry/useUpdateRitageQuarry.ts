import { FileWithPath } from '@mantine/dropzone';
import { useMutation } from '@tanstack/react-query';

import axiosClient from '@/services/restapi/axiosClient';
import { IMutationRitageQuarry } from '@/services/restapi/ritage-productions/quarry/useCreateRitageQuarry';

import { AxiosRestErrorResponse } from '@/types/global';

interface IUpdateRitageQuarryResponse {
  message: string;
}

type IPropsRequest = {
  id: string;
  data: {
    name: keyof IMutationRitageQuarry;
    value: string | FileWithPath[] | null;
  }[];
  deletedPhotoIds: string[];
};

const UpdateRitageQuarry = async ({
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

  const response = await axiosAuth.patch(`/quarry-ritages/${id}`, bodyFormData);
  return response?.data;
};

export const useUpdateRitageQuarry = ({
  onError,
  onSuccess,
}: {
  onSuccess?: (success: IUpdateRitageQuarryResponse) => void;
  onError?: (error: AxiosRestErrorResponse<IMutationRitageQuarry>) => unknown;
}) => {
  return useMutation<
    IUpdateRitageQuarryResponse,
    AxiosRestErrorResponse<IMutationRitageQuarry>,
    IPropsRequest
  >({
    mutationFn: async (value) => {
      const data = await UpdateRitageQuarry(value);
      return data;
    },
    onError: onError,
    onSuccess: onSuccess,
  });
};
