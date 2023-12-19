import { FileWithPath } from '@mantine/dropzone';
import { useMutation } from '@tanstack/react-query';

import axiosClient from '@/services/restapi/axiosClient';
import { IMutationRitageTopsoil } from '@/services/restapi/ritage-productions/topsoil/useCreateRitageTopsoil';

import { AxiosRestErrorResponse } from '@/types/global';

interface IUpdateRitageTopsoilResponse {
  message: string;
}

type IPropsRequest = {
  id: string;
  data: {
    name: keyof IMutationRitageTopsoil;
    value: string | FileWithPath[] | null;
  }[];
  deletedPhotoIds: string[];
};

const UpdateRitageTopsoil = async ({
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

  const response = await axiosAuth.patch(
    `/topsoil-ritages/${id}`,
    bodyFormData
  );
  return response?.data;
};

export const useUpdateRitageTopsoil = ({
  onError,
  onSuccess,
}: {
  onSuccess?: (success: IUpdateRitageTopsoilResponse) => void;
  onError?: (error: AxiosRestErrorResponse<IMutationRitageTopsoil>) => unknown;
}) => {
  return useMutation<
    IUpdateRitageTopsoilResponse,
    AxiosRestErrorResponse<IMutationRitageTopsoil>,
    IPropsRequest
  >({
    mutationFn: async (value) => {
      const data = await UpdateRitageTopsoil(value);
      return data;
    },
    onError: onError,
    onSuccess: onSuccess,
  });
};
