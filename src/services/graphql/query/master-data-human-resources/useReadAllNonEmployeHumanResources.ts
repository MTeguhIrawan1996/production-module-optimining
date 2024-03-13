import {
  ApolloError,
  gql,
  useQuery,
  WatchQueryFetchPolicy,
} from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_NON_EMPLOYE_HUMAN_RESOURCES = gql`
  query ReadAllNonEmployeedHumanResources(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
    $excludeIds: [String!]
  ) {
    nonEmployeedHumanResources(
      findAllNonEmployeedHumanResourceDto: {
        page: $page
        limit: $limit
        search: $search
        orderBy: $orderBy
        orderDir: $orderDir
        excludeIds: $excludeIds
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
        phoneNumber
        identityNumber
      }
    }
  }
`;

export interface INonEmployeedHumanResourcesData {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  identityNumber: string;
}

interface INonEmployeedHumanResourcesResponse {
  nonEmployeedHumanResources: GResponse<INonEmployeedHumanResourcesData>;
}

interface INonEmployeedHumanResourcesRequest extends IGlobalMetaRequest {
  excludeIds: string[] | null;
}

export const useReadAllNonEmployeedHumanResourcesMasterData = ({
  variables,
  onCompleted,
  skip,
  fetchPolicy = 'cache-first',
}: {
  variables?: Partial<INonEmployeedHumanResourcesRequest>;
  onCompleted?: (data: INonEmployeedHumanResourcesResponse) => void;
  skip?: boolean;
  fetchPolicy?: WatchQueryFetchPolicy;
}) => {
  const {
    data: nonEmployeedHumanResourcesData,
    loading: nonEmployeedHumanResourcesDataLoading,
    refetch,
  } = useQuery<
    INonEmployeedHumanResourcesResponse,
    Partial<INonEmployeedHumanResourcesRequest>
  >(READ_ALL_NON_EMPLOYE_HUMAN_RESOURCES, {
    variables: variables,
    skip: skip,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted,
    fetchPolicy,
  });

  return {
    nonEmployeedHumanResourcesData:
      nonEmployeedHumanResourcesData?.nonEmployeedHumanResources.data,
    nonEmployeedHumanResourcesDataMeta:
      nonEmployeedHumanResourcesData?.nonEmployeedHumanResources.meta,
    nonEmployeedHumanResourcesDataLoading,
    refetchNonEmployeedHumanResources: refetch,
  };
};
