import { useQuery } from '@tanstack/react-query';

import axiosClient from '@/services/restapi/axiosClient';

import { AxiosRestErrorResponse, IFile } from '@/types/global';

export interface IReadOneUploadFile {
  id: string;
  file: Omit<IFile, 'mime' | 'path'>[] | null;
  total: number;
  succeed: number;
  processed: number;
  failedData: unknown[];
}

export type IReadOneUploadFileResponse = IReadOneUploadFile;

export interface IReadOneUploadFileRequest {
  id: string;
}

const ReadOneUploadFileTRK = async ({ id }: IReadOneUploadFileRequest) => {
  const axiosAuth = axiosClient();
  const response = await axiosAuth.get(`/upload-file-datas/${id}`);
  return response.data;
};

export const useReadOneUploadFileTRK = ({
  variable,
  onSuccess,
  onError,
}: {
  variable: IReadOneUploadFileRequest;
  onSuccess?: (data: IReadOneUploadFileResponse) => void;
  onError?: (
    error: AxiosRestErrorResponse<Omit<IReadOneUploadFile, 'id'>>
  ) => unknown;
}) => {
  const { id } = variable;

  return useQuery<
    IReadOneUploadFileResponse,
    AxiosRestErrorResponse<Omit<IReadOneUploadFile, 'id'>>
  >({
    queryFn: async () => {
      const data = await ReadOneUploadFileTRK({ id });
      return data;
    },
    onSuccess: onSuccess,
    onError: onError,
    queryKey: ['fileData', { id }],
    enabled: !!id,
    refetchInterval: (data) => {
      if (data?.processed === data?.total) {
        return false;
      }
      if (data?.succeed === data?.total) {
        return false;
      }
      return 500;
    },
  });
};
