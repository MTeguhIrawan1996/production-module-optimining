import { FileWithPath } from '@mantine/dropzone';
import { useMutation } from '@tanstack/react-query';

import axiosClient from '@/services/restapi/axiosClient';
import { IMutationRitageOre } from '@/services/restapi/ritage-productions/ore/useCreateRitageOre';

import { AxiosRestErrorResponse } from '@/types/global';

interface IUpdateRitageOreResponse {
  message: string;
}

type IPropsRequest = {
  id: string;
  data: {
    name: keyof IMutationRitageOre;
    value: string | FileWithPath[] | boolean | null;
  }[];
  deletedPhotoIds: string[];
};

const UpdateRitageOre = async ({
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

  const response = await axiosAuth.patch(`/ore-ritages/${id}`, bodyFormData);
  return response?.data;
};

export const useUpdateRitageOre = ({
  onError,
  onSuccess,
}: {
  onSuccess?: (success: IUpdateRitageOreResponse) => void;
  onError?: (error: AxiosRestErrorResponse<IMutationRitageOre>) => unknown;
}) => {
  return useMutation<
    IUpdateRitageOreResponse,
    AxiosRestErrorResponse<IMutationRitageOre>,
    IPropsRequest
  >({
    mutationFn: async (value) => {
      const data = await UpdateRitageOre(value);
      return data;
    },
    onError: onError,
    onSuccess: onSuccess,
  });
};
