import { ApolloError, gql, useMutation } from '@apollo/client';

export const DELETE_ROLE = gql`
  mutation DeleteRole($id: String!) {
    deleteRole(id: $id)
  }
`;

export interface IDeleteRoleRequest {
  id: string;
}

interface IDeleteRoleResponse {
  deleteRole: boolean;
}

export const useDeleteRole = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IDeleteRoleResponse) => void;
}) => {
  return useMutation<IDeleteRoleResponse, IDeleteRoleRequest>(DELETE_ROLE, {
    onError,
    onCompleted,
  });
};
