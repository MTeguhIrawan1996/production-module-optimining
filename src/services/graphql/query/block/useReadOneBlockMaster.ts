import { ApolloError, gql, useQuery } from '@apollo/client';

export const READ_ONE_BLOCK_MASTER = gql`
  query ReadOneBlockMaster($id: String!) {
    block(id: $id) {
      id
      handBookId
      name
    }
  }
`;

export interface IReadOneBlockMaster {
  id: string;
  handBookId: string;
  name: string;
}

export interface IReadOneBlockMasterResponse {
  block: IReadOneBlockMaster;
}

export interface IReadOneBlockMasterRequest {
  id: string;
}

export const useReadOneBlockMaster = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: IReadOneBlockMasterRequest;
  skip?: boolean;
  onCompleted?: (data: IReadOneBlockMasterResponse) => void;
}) => {
  const { data: blockMaster, loading: blockMasterLoading } = useQuery<
    IReadOneBlockMasterResponse,
    IReadOneBlockMasterRequest
  >(READ_ONE_BLOCK_MASTER, {
    variables,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted: onCompleted,
    skip,
    fetchPolicy: 'cache-and-network',
  });

  return {
    blockMaster: blockMaster?.block,
    blockMasterLoading,
  };
};
