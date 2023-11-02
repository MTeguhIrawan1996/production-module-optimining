import { ApolloError, gql, useMutation } from '@apollo/client';

export const UPDATE_ROLE = gql`
  mutation UpdateRole(
    $id: String!
    $name: String!
    $desc: String
    $permissionIds: [String!]
  ) {
    updateRole(
      updateRoleInput: {
        id: $id
        name: $name
        desc: $desc
        permissionIds: $permissionIds
      }
    ) {
      id
    }
  }
`;

export interface IUpdateRoleRequest {
  id: string;
  name: string;
  desc: string;
  permissionIds: string[];
}

interface IUpdateRoleResponse {
  updateRole: {
    id: string;
  };
}

export const useUpdateRole = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateRoleResponse) => void;
}) => {
  return useMutation<IUpdateRoleResponse, IUpdateRoleRequest>(UPDATE_ROLE, {
    onError,
    onCompleted,
  });
};
