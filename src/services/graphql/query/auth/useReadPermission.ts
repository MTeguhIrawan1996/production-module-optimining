import { ApolloError, gql, useQuery } from '@apollo/client';

export const PERMISSION_USER = gql`
  query PermissionUser {
    authUser {
      id
      role {
        id
        slug
        permissions {
          data {
            slug
          }
        }
      }
    }
  }
`;

export interface IGetPermissionResponse {
  authUser: IGetPermissionData;
}

export interface IPermissionAuth {
  name: string;
  slug: string;
}

export interface IGetPermissionData {
  id: string;
  role: {
    id: string;
    slug: string;
    permissions: {
      data: {
        name: string;
        slug: string;
      }[];
    };
  };
}

export const useReadPermissionUser = (req?: {
  skip?: boolean;
  onCompleted?: (data: IGetPermissionResponse) => void;
}) => {
  const { data: userPermission, loading: readPermissionLoading } =
    useQuery<IGetPermissionResponse>(PERMISSION_USER, {
      onError: (err: ApolloError) => {
        return err;
      },
      onCompleted: req?.onCompleted,
      skip: req?.skip,
      fetchPolicy: 'cache-and-network',
    });

  return {
    userPermission: userPermission?.authUser,
    readPermissionLoading,
  };
};
