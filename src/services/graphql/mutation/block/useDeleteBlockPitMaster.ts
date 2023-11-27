import { ApolloError, gql, useMutation } from '@apollo/client';

export const DELETE_BLOCK_PIT_MASTER = gql`
  mutation DeleteBlockPitMaster($id: String!) {
    deletePit(id: $id)
  }
`;

export interface IDeletePitMasterRequest {
  id: string;
}

interface IDeletePitMasterResponse {
  deletePit: boolean;
}

export const useDeleteBlockPitMaster = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IDeletePitMasterResponse) => void;
}) => {
  return useMutation<IDeletePitMasterResponse, IDeletePitMasterRequest>(
    DELETE_BLOCK_PIT_MASTER,
    {
      onError,
      onCompleted,
    }
  );
};
