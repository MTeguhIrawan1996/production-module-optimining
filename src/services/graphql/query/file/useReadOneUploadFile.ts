import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { getSession } from 'next-auth/react';

import { gqlClient } from '@/services/graphql/graphql-request';

import { IFile } from '@/types/global';

export const READ_ONE_UPLOAD_FILE = gql`
  query ReadOneUploadFile($id: String!) {
    uploadFileData(id: $id) {
      id
      file {
        id
        originalFileName
        url
        fileName
      }
      total
      succeed
      processed
      failedData
    }
  }
`;

export interface IReadOneUploadFile {
  id: string;
  file: Omit<IFile, 'mime' | 'path'>[] | null;
  total: number;
  succeed: number;
  processed: number;
  failedData: unknown[];
}

export interface IReadOneUploadFileResponse {
  uploadFileData: IReadOneUploadFile;
}

export interface IReadOneUploadFileRequest {
  id: string;
}

export const useReadOneUploadFileTRK = ({
  variable,
  onSuccess,
}: {
  variable: IReadOneUploadFileRequest;
  onSuccess?: () => void;
}) => {
  const { id } = variable;

  return useQuery<IReadOneUploadFileResponse | null, any>({
    queryFn: async () => {
      const session = await getSession();
      const authorization = session
        ? `Bearer ${session.user.login.accessToken.token}`
        : '';
      gqlClient.setHeaders({
        authorization,
      });

      try {
        return await gqlClient.request(
          READ_ONE_UPLOAD_FILE,
          // variables are type-checked too!
          { id: id }
        );
      } catch (error) {
        return null;
      }
    },
    onSuccess: onSuccess,
    queryKey: ['fileData', { id }],
    enabled: !!id,
    refetchInterval: (data) => {
      if (data?.uploadFileData.processed === data?.uploadFileData.total) {
        return false;
      }
      if (data?.uploadFileData.succeed === data?.uploadFileData.total) {
        return false;
      }
      return 3000;
    },
  });
};
