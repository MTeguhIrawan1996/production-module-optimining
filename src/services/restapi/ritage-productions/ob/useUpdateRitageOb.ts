import { FileWithPath } from '@mantine/dropzone';
import { useMutation } from '@tanstack/react-query';

import axiosClient from '@/services/restapi/axiosClient';
import { IMutationRitageOb } from '@/services/restapi/ritage-productions/ob/useCreateRitageOb';

import { AxiosRestErrorResponse } from '@/types/global';

interface IUpdateRitageObResponse {
  message: string;
}

type IPropsRequest = {
  id: string;
  data: {
    name: keyof IMutationRitageOb;
    value: string | FileWithPath[] | null;
  }[];
  deletedPhotoIds: string[];
};

const UpdateRitageOb = async ({ data, deletedPhotoIds, id }: IPropsRequest) => {
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
    `/overburden-ritages/${id}`,
    bodyFormData
  );
  return response?.data;
};

export const useUpdateRitageOb = ({
  onError,
  onSuccess,
}: {
  onSuccess?: (success: IUpdateRitageObResponse) => void;
  onError?: (error: AxiosRestErrorResponse<IMutationRitageOb>) => unknown;
}) => {
  return useMutation<
    IUpdateRitageObResponse,
    AxiosRestErrorResponse<IMutationRitageOb>,
    IPropsRequest
  >({
    mutationFn: async (value) => {
      const data = await UpdateRitageOb(value);
      return data;
    },
    onError: onError,
    onSuccess: onSuccess,
  });
};
