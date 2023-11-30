import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_DOME = gql`
  query ReadAllDome(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
    $stockpileId: String
  ) {
    domes(
      findAllDomeInput: {
        page: $page
        limit: $limit
        search: $search
        orderBy: $orderBy
        orderDir: $orderDir
        stockpileId: $stockpileId
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
        handBookId
        name
      }
    }
  }
`;

export interface IReadAllDome {
  id: string;
  handBookId: string;
  name: string;
}

export interface IReadAllDomeResponse {
  domes: GResponse<IReadAllDome>;
}

interface IReadAllDomeRequest extends Partial<IGlobalMetaRequest> {
  stockpileId?: string | null;
}

export const useReadAllDome = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: IReadAllDomeRequest;
  skip?: boolean;
  onCompleted?: (data: IReadAllDomeResponse) => void;
}) => {
  const {
    data: domeData,
    loading: domeDataLoading,
    refetch,
  } = useQuery<IReadAllDomeResponse, IReadAllDomeRequest>(READ_ALL_DOME, {
    variables,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted: onCompleted,
    skip,
    fetchPolicy: 'cache-and-network',
  });

  return {
    domeData: domeData?.domes.data,
    domeDataMeta: domeData?.domes.meta,
    domeDataLoading,
    refetchStockpiles: refetch,
  };
};
