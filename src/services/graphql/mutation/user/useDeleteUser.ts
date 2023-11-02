import { ApolloError, gql, useMutation } from '@apollo/client';

export const DELETE_USER = gql`
  mutation DeleteUser($id: String!) {
    deleteUser(id: $id)
  }
`;

export interface IDeleteUserRequest {
  id: string;
}

interface IDeleteUserResponse {
  deleteUser: boolean;
}

export const useDeleteUser = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IDeleteUserResponse) => void;
}) => {
  return useMutation<IDeleteUserResponse, IDeleteUserRequest>(DELETE_USER, {
    onError,
    onCompleted,
  });
};
