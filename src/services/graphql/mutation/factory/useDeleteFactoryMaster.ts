import { ApolloError, gql, useMutation } from '@apollo/client';

export const DELETE_FACTORY_MASTER = gql`
  mutation DeleteFactoryMaster($id: String!) {
    deleteFactory(id: $id)
  }
`;

export interface IDeleteFactoryMasterRequest {
  id: string;
}

interface IDeleteFactoryMasterResponse {
  deleteFactory: boolean;
}

export const useDeleteFactoryMaster = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IDeleteFactoryMasterResponse) => void;
}) => {
  return useMutation<IDeleteFactoryMasterResponse, IDeleteFactoryMasterRequest>(
    DELETE_FACTORY_MASTER,
    {
      onError,
      onCompleted,
    }
  );
};
