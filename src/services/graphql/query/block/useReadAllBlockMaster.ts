import {
  ApolloError,
  gql,
  useQuery,
  WatchQueryFetchPolicy,
} from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_BLOCK_MASTER = gql`
  query ReadAllBlock(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
  ) {
    blocks(
      findAllBlockInput: {
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

interface IBlocksData {
  id: string;
  name: string;
  handBookId: string;
}

interface IBlocksResponse {
  blocks: GResponse<IBlocksData>;
}

export const useReadAllBlocksMaster = ({
  variables,
  onCompleted,
  skip,
  fetchPolicy = 'cache-first',
}: {
  variables?: Partial<IGlobalMetaRequest>;
  onCompleted?: (data: IBlocksResponse) => void;
  skip?: boolean;
  fetchPolicy?: WatchQueryFetchPolicy;
}) => {
  const {
    data: blocksData,
    loading: blocksDataLoading,
    refetch,
  } = useQuery<IBlocksResponse, Partial<IGlobalMetaRequest>>(
    READ_ALL_BLOCK_MASTER,
    {
      variables: variables,
      skip: skip,
      onError: (err: ApolloError) => {
        return err;
      },
      onCompleted,
      fetchPolicy,
    }
  );

  return {
    blocksData: blocksData?.blocks.data,
    blocksDataMeta: blocksData?.blocks.meta,
    blocksDataLoading,
    refetchBlocks: refetch,
  };
};
