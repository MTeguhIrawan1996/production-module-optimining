import { ApolloError, gql, useMutation } from '@apollo/client';

export const DELETE_ELEMENT_MASTER = gql`
  mutation DeleteElementMaster($id: String!) {
    deleteElement(id: $id)
  }
`;

export interface IDeleteElementMasterRequest {
  id: string;
}

interface IDeleteElementMasterResponse {
  deleteElement: boolean;
}

export const useDeleteElementMaster = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IDeleteElementMasterResponse) => void;
}) => {
  return useMutation<IDeleteElementMasterResponse, IDeleteElementMasterRequest>(
    DELETE_ELEMENT_MASTER,
    {
      onError,
      onCompleted,
    }
  );
};
