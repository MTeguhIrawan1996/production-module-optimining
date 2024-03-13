import {
  ApolloError,
  gql,
  useQuery,
  WatchQueryFetchPolicy,
} from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_BLOCK_PIT_MASTER = gql`
  query ReadAllBlockPitMaster(
    $id: String!
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
  ) {
    block(id: $id) {
      id
      pits(
        findAllPitInput: {
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

export interface IReadAllBlockPitMaster {
  id: string;
  handBookId: string;
  name: string;
}

export interface IReadAllBlockPitMasterResponse {
  block: {
    pits: GResponse<IReadAllBlockPitMaster>;
  };
}

interface IReadAllBlockPitMasterRequest extends Partial<IGlobalMetaRequest> {
  id: string;
}

export const useReadAllBlockPitMaster = ({
  variables,
  skip,
  onCompleted,
  fetchPolicy = 'cache-first',
}: {
  variables: IReadAllBlockPitMasterRequest;
  skip?: boolean;
  onCompleted?: (data: IReadAllBlockPitMasterResponse) => void;
  fetchPolicy?: WatchQueryFetchPolicy;
}) => {
  const {
    data: blockPitMaster,
    loading: blockPitMasterLoading,
    refetch,
  } = useQuery<IReadAllBlockPitMasterResponse, IReadAllBlockPitMasterRequest>(
    READ_ALL_BLOCK_PIT_MASTER,
    {
      variables,
      onError: (err: ApolloError) => {
        return err;
      },
      onCompleted: onCompleted,
      skip,
      fetchPolicy,
    }
  );

  return {
    blockPitMaster: blockPitMaster?.block.pits.data,
    blockPitMasterMeta: blockPitMaster?.block.pits.meta,
    blockPitMasterLoading,
    refetchBlocks: refetch,
  };
};
