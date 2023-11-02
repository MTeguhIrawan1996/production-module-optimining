import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_MANAGEMENT_ROLE = gql`
  query ReadAllManagementRole(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
  ) {
    roles(
      findAllRoleInput: {
        page: $page
        limit: $limit
        search: $search
        orderBy: $orderBy
        orderDir: $orderDir
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
        slug
        desc
      }
    }
  }
`;

export interface IManagementRolesData {
  id: string;
  name: string;
  slug: string;
  desc: string | null;
}

interface IManagementRolesResponse {
  roles: GResponse<IManagementRolesData>;
}

export const useReadAllManagementRole = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: Partial<IGlobalMetaRequest>;
  onCompleted?: (data: IManagementRolesResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: rolesData,
    loading: rolesLoading,
    refetch,
  } = useQuery<IManagementRolesResponse, Partial<IGlobalMetaRequest>>(
    READ_ALL_MANAGEMENT_ROLE,
    {
      variables: variables,
      skip: skip,
      onError: (err: ApolloError) => {
        return err;
      },
      onCompleted,
      fetchPolicy: 'cache-and-network',
    }
  );

  return {
    rolesData: rolesData?.roles.data,
    rolesMeta: rolesData?.roles.meta,
    rolesLoading,
    refetch,
  };
};
