import { ApolloError, gql, useQuery } from '@apollo/client';

export const READ_ONE_BLOCK_PIT_MASTER = gql`
  query ReadOneBlockPitMaster($id: String!) {
    pit(id: $id) {
      id
      handBookId
      name
      block {
        id
        name
      }
    }
  }
`;

export interface IReadOneBlockPitMaster {
  id: string;
  handBookId: string;
  name: string;
  block: {
    id: string;
    name: string;
  };
}

export interface IReadOneBlockPitMasterResponse {
  pit: IReadOneBlockPitMaster;
}

export interface IReadOneBlockPitMasterRequest {
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
  const { data: blockPitMaster, loading: blockPitMasterLoading } = useQuery<
    IReadOneBlockPitMasterResponse,
    IReadOneBlockPitMasterRequest
  >(READ_ONE_BLOCK_PIT_MASTER, {
    variables,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted: onCompleted,
    skip,
    fetchPolicy: 'cache-and-network',
  });

  return {
    blockPitMaster: blockPitMaster?.pit,
    blockPitMasterLoading,
  };
};
