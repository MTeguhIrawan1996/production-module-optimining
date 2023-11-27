import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ONE_BLOCK_PIT_MASTER = gql`
  query ReadOneBlockPitMaster(
    $id: String!
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
  ) {
    block(id: $id) {
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

export interface IReadOneBlockPitMaster {
  id: string;
  handBookId: string;
  name: string;
}

export interface IReadOneBlockPitMasterResponse {
  block: {
    pits: GResponse<IReadOneBlockPitMaster>;
  };
}

interface IReadOneBlockPitMasterRequest extends Partial<IGlobalMetaRequest> {
  id: string;
}

export const useReadOneBlockPitMaster = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: IReadOneBlockPitMasterRequest;
  skip?: boolean;
  onCompleted?: (data: IReadOneBlockPitMasterResponse) => void;
}) => {
  const {
    data: blockPitMaster,
    loading: blockPitMasterLoading,
    refetch,
  } = useQuery<IReadOneBlockPitMasterResponse, IReadOneBlockPitMasterRequest>(
    READ_ONE_BLOCK_PIT_MASTER,
    {
      variables,
      onError: (err: ApolloError) => {
        return err;
      },
      onCompleted: onCompleted,
      skip,
      fetchPolicy: 'cache-and-network',
    }
  );

  return {
    blockPitMaster: blockPitMaster?.block.pits.data,
    blockPitMasterMeta: blockPitMaster?.block.pits.meta,
    blockPitMasterLoading,
    refetchBlocks: refetch,
  };
};
