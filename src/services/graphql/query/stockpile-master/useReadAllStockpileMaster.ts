import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_STOCK_MASTER = gql`
  query ReadAllStockpileMaster(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
  ) {
    stockpiles(
      findAllStockpileInput: {
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
        handBookId
      }
    }
  }
`;

export interface IStockpilesData {
  id: string;
  name: string;
  handBookId: string;
}

interface IStockpilesResponse {
  stockpiles: GResponse<IStockpilesData>;
}

export const useReadAllStockpileMaster = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: Partial<IGlobalMetaRequest>;
  onCompleted?: (data: IStockpilesResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: stockpilesData,
    loading: stockpilesDataLoading,
    refetch,
  } = useQuery<IStockpilesResponse, Partial<IGlobalMetaRequest>>(
    READ_ALL_STOCK_MASTER,
    {
      variables: variables,
      skip: skip,
      onError: (err: ApolloError) => {
        return err;
      },
      onCompleted,
      fetchPolicy: 'cache-and-network',
    }
  );

  return {
    stockpilesData: stockpilesData?.stockpiles.data,
    stockpilesDataMeta: stockpilesData?.stockpiles.meta,
    stockpilesDataLoading,
    refetchStockpiles: refetch,
  };
};
