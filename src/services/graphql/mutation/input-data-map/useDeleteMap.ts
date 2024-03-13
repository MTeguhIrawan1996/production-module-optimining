import { ApolloError, gql, useMutation } from '@apollo/client';

export const DELETE_MAP_MASTER = gql`
  mutation delete($id: String!) {
    deleteMapData(input: { id: $id })
  }
`;

export interface IDeleteMapRequest {
  id: string;
}

interface IDeleteMapResponse {
  deleteMapData: string;
}

export const useDeleteMap = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IDeleteMapResponse) => void;
}) => {
  return useMutation<IDeleteMapResponse, IDeleteMapRequest>(DELETE_MAP_MASTER, {
    onError,
    onCompleted,
  });
};
