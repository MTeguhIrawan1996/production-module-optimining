import { gql } from '@apollo/client';
import { useQuery } from '@tanstack/react-query';

import getClient from '@/services/graphql/apollo-client';

import { GResponse, IFile, IGlobalMetaRequest } from '@/types/global';

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

export const READ_ALL_COMMON_DOWNLOAD = gql`
  query ReadAllCommonDownload(
    $page: Int
    $limit: Int
    $entity: EntityDownloadEnum
    $timeFilterType: TimeFilterTypeDownloadEnum
    $ids: [String!]
  ) {
    findDownloadTasks(
      findDownloadTasksInput: {
        page: $page
        limit: $limit
        entity: $entity
        timeFilterType: $timeFilterType
        ids: $ids
      }
    ) {
      meta {
        currentPage
        totalPage
        totalData
        totalAllData
      }
      data {
        id
        entity
        progress
        status
        message
        filePath
      }
    }
  }
`;

export interface IReadAllDownloadData {
  id: string;
  entity: string;
  progress: number;
  status: string;
  message: string | null;
  filePath: string | null;
}

interface IReadAllCommonDownloadResponse {
  findDownloadTasks: GResponse<IReadAllDownloadData>;
}

interface IReadAllFrontProductionRequest extends IGlobalMetaRequest {
  entity: string | null;
  timeFilterType: string | null;
  ids: string[];
}

export const useReadAllCommonDownload = ({
  variable,
  onSuccess,
  onRefatch,
  onError,
}: {
  variable: Partial<IReadAllFrontProductionRequest>;
  onSuccess?: (data: IReadAllCommonDownloadResponse) => void;
  onRefatch?: (data: IReadAllCommonDownloadResponse | undefined) => void;
  onError?: any;
}) => {
  const { client } = getClient();
  const MINUTE = 1000 * 60;

  const { ids, entity, timeFilterType, limit } = variable;
  const isActive = ids && ids?.length >= 1;

  return useQuery<IReadAllCommonDownloadResponse>({
    queryFn: async () => {
      const response = await client.query<
        IReadAllCommonDownloadResponse,
        Partial<IReadAllFrontProductionRequest>
      >({
        query: READ_ALL_COMMON_DOWNLOAD,
        variables: {
          entity,
          timeFilterType,
          limit,
          ids,
        },
        fetchPolicy: 'network-only',
        notifyOnNetworkStatusChange: true,
      });
      return response.data;
    },
    onSuccess: onSuccess,
    onError: onError,
    queryKey: ['commonDownload', { ids }],
    enabled: isActive,
    refetchIntervalInBackground: true,
    cacheTime: 1 * MINUTE,
    refetchInterval: (data) => {
      onRefatch?.(data);
      if (!data) {
        return false;
      }
      if (data?.findDownloadTasks.meta.totalAllData === 0) {
        return false;
      }
      return 3000;
    },
  });
};
