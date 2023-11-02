import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_USER = gql`
  query ReadAllUser(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
    $roleId: String
  ) {
    users(
      findAllUserInput: {
        page: $page
        limit: $limit
        search: $search
        orderBy: $orderBy
        orderDir: $orderDir
        roleId: $roleId
      }
    ) {
      meta {
        currentPage
        totalPage
        totalData
        totalAllData
      }
      data {
        id
        name
        email
        isActive
      }
    }
  }
`;

interface IUsersData {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
}

interface IUsersResponse {
  users: GResponse<IUsersData>;
}

interface IUserRequest extends Partial<IGlobalMetaRequest> {
  roleId?: string;
}

export const useReadAllUser = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: IUserRequest;
  onCompleted?: (data: IUsersResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: usersData,
    loading: usersLoading,
    refetch,
  } = useQuery<IUsersResponse, IUserRequest>(READ_ALL_USER, {
    variables: variables,
    skip: skip,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted,
    fetchPolicy: 'cache-and-network',
  });

  return {
    usersData: usersData?.users.data,
    usersMeta: usersData?.users.meta,
    usersLoading,
    refetch,
  };
};
