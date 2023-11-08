import { ApolloError, gql, useQuery } from '@apollo/client';

export const READ_ONE_ROLE = gql`
  query ReadRole($id: String!) {
    role(id: $id) {
      id
      name
      slug
      desc
      modules {
        data {
          name
          permissions(findAllPermissionInput: { roleId: $id }) {
            data {
              id
              name
              action {
                id
                name
              }
            }
          }
        }
      }
    }
  }
`;

export interface IRoleData {
  id: string;
  name: string;
  slug: string;
  desc: string | null;
  modules: {
    data: {
      name: string;
      permissions: {
        data: {
          id: string;
          name: string;
          action: {
            id: string;
            name: string;
          };
        }[];
      };
    }[];
  };
}

export interface IRoleResponse {
  role: IRoleData;
}

export interface IRoleRequest {
  id: string;
}

export const useReadOneRole = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: IRoleRequest;
  skip?: boolean;
  onCompleted?: (data: IRoleResponse) => void;
}) => {
  const { data: roleData, loading: roleDataLoading } = useQuery<
    IRoleResponse,
    IRoleRequest
  >(READ_ONE_ROLE, {
    variables,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted: onCompleted,
    skip,
    fetchPolicy: 'cache-and-network',
  });

  return {
    roleData: roleData?.role,
    roleDataLoading,
  };
};
