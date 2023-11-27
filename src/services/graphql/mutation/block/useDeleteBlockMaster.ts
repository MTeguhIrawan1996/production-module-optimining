import { ApolloError, gql, useMutation } from '@apollo/client';

export const DELETE_BLOCK_MASTER = gql`
  mutation DeleteBlockMaster($id: String!) {
    deleteBlock(id: $id)
  }
`;

export interface IDeleteBlockMasterRequest {
  id: string;
}

interface IDeleteBlockMasterResponse {
  deleteBlock: boolean;
}

export const useDeleteBlockMaster = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IDeleteBlockMasterResponse) => void;
}) => {
  return useMutation<IDeleteBlockMasterResponse, IDeleteBlockMasterRequest>(
    DELETE_BLOCK_MASTER,
    {
      onError,
      onCompleted,
    }
  );
};
