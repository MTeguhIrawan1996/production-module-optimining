import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_MAP_CATEGORY = gql`
  query mapDataCategories(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
  ) {
    mapDataCategories(
      input: {
        page: $page
        limit: $limit
        search: $search
        orderBy: $orderBy
        orderDir: $orderDir
      }
    ) {
      data {
        id
        name
      }
      additional
      meta {
        currentPage
        totalPage
        totalData
        totalAllData
      }
    }
  }
`;

export interface IMapCategoryData {
  id: string;
  name: string;
}

interface IMapCategoryResponse {
  mapDataCategories: GResponse<IMapCategoryData>;
}

export const useReadAllMapCategory = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: Partial<IGlobalMetaRequest>;
  onCompleted?: (data: IMapCategoryResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: mapCategoryData,
    loading: mapCategoryDataLoading,
    refetch,
  } = useQuery<IMapCategoryResponse>(READ_ALL_MAP_CATEGORY, {
    variables: variables,
    skip: skip,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted,
    fetchPolicy: 'cache-and-network',
  });

  return {
    mapCategoryData: mapCategoryData?.mapDataCategories.data,
    mapCategoryMeta: mapCategoryData?.mapDataCategories.meta,
    mapCategoryDataLoading,
    refetchLocations: refetch,
  };
};
