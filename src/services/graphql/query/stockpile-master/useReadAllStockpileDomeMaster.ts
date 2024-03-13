import {
  ApolloError,
  gql,
  useQuery,
  WatchQueryFetchPolicy,
} from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_STOCKPILE_DOME_MASTER = gql`
  query ReadAllStockpileDomeMaster(
    $id: String!
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
  ) {
    stockpile(id: $id) {
      id
      domes(
        findAllDomeInput: {
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
          handBookId
          name
        }
      }
    }
  }
`;

export interface IReadAllStockpileDomeMaster {
  id: string;
  handBookId: string;
  name: string;
}

export interface IReadAllStockpileDomeMasterResponse {
  stockpile: {
    domes: GResponse<IReadAllStockpileDomeMaster>;
  };
}

interface IReadAllStockpileDomeMasterRequest
  extends Partial<IGlobalMetaRequest> {
  id: string;
}

export const useReadAllStockpileDomeMaster = ({
  variables,
  skip,
  onCompleted,
  fetchPolicy = 'cache-first',
}: {
  variables: IReadAllStockpileDomeMasterRequest;
  skip?: boolean;
  onCompleted?: (data: IReadAllStockpileDomeMasterResponse) => void;
  fetchPolicy?: WatchQueryFetchPolicy;
}) => {
  const {
    data: stockpileDomeMaster,
    loading: stockpileDomeMasterLoading,
    refetch,
  } = useQuery<
    IReadAllStockpileDomeMasterResponse,
    IReadAllStockpileDomeMasterRequest
  >(READ_ALL_STOCKPILE_DOME_MASTER, {
    variables,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted: onCompleted,
    skip,
    fetchPolicy,
  });

  return {
    stockpileDomeMaster: stockpileDomeMaster?.stockpile.domes.data,
    stockpileDomeMasterMeta: stockpileDomeMaster?.stockpile.domes.meta,
    stockpileDomeMasterLoading,
    refetchStockpiles: refetch,
  };
};
