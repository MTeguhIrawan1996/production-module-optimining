import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_IDENTITY_TYPE = gql`
  query ReadAllIdentityType(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
  ) {
    identityTypes(
      findAllIdentityTypeInput: {
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
      }
    }
  }
`;

export interface IIdentityTypeData {
  id: string;
  name: string;
}

interface IIdentityTypesResponse {
  identityTypes: GResponse<IIdentityTypeData>;
}

export const useReadAllIdentityType = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: Partial<IGlobalMetaRequest>;
  onCompleted?: (data: IIdentityTypesResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: identityTypesData,
    loading: identityTypesDataLoading,
    refetch,
  } = useQuery<IIdentityTypesResponse, Partial<IGlobalMetaRequest>>(
    READ_ALL_IDENTITY_TYPE,
    {
      variables: variables,
      skip: skip,
      onError: (err: ApolloError) => {
        return err;
      },
      onCompleted,
      fetchPolicy: 'cache-first',
    }
  );

  return {
    identityTypesData: identityTypesData?.identityTypes.data,
    identityTypesDataMeta: identityTypesData?.identityTypes.meta,
    identityTypesDataLoading,
    refetchIdentityTypesData: refetch,
  };
};
