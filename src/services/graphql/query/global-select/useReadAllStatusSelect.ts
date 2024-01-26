import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_STATUS_SELECT = gql`
  query ReadAllStatusSelect(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
  ) {
    statuses(
      findAllStatusInput: {
        page: $page
        limit: $limit
        search: $search
        orderBy: $orderBy
        orderDir: $orderDir
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
        name
        slug
      }
    }
  }
`;

export interface IReadAllStatusSelectData {
  id: string;
  name: string;
}

interface IReadAllStatusSelectResponse {
  statuses: GResponse<IReadAllStatusSelectData>;
}
export const useReadAllStatusSelect = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: Partial<IGlobalMetaRequest>;
  onCompleted?: (data: IReadAllStatusSelectResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: statusesData,
    loading: statusesDataLoading,
    refetch,
  } = useQuery<IReadAllStatusSelectResponse, Partial<IGlobalMetaRequest>>(
    READ_ALL_STATUS_SELECT,
    {
      variables,
      skip: skip,
      onError: (err: ApolloError) => {
        return err;
      },
      onCompleted,
      fetchPolicy: 'cache-first',
    }
  );

  return {
    statusesData: statusesData?.statuses.data,
    statusesDataLoading,
    refetchStatusesData: refetch,
  };
};
