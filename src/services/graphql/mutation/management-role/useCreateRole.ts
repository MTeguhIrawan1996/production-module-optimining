import { ApolloError, gql, useMutation } from '@apollo/client';

export const CREATE_ROLE = gql`
  mutation CreateRole(
    $name: String!
    $desc: String
    $permissionIds: [String!]
  ) {
    createRole(
      createRoleInput: {
        name: $name
        desc: $desc
        permissionIds: $permissionIds
      }
    ) {
      id
    }
  }
`;

export interface ICreateRoleRequest {
  name: string;
  desc: string;
  permissionIds: string[];
}

interface ICreateRoleResponse {
  createRole: {
    id: string;
  };
}

export const useCreateRole = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: ICreateRoleResponse) => void;
}) => {
  return useMutation<ICreateRoleResponse, ICreateRoleRequest>(CREATE_ROLE, {
    onError,
    onCompleted,
  });
};
