import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_LOCATION_CATEGORY = gql`
  query ReadAllLoactionCategory(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
    $excludeIds: [String!]
  ) {
    locationCategories(
      findAllLocationCategoryInput: {
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
        slug
      }
    }
  }
`;

export interface ILocationCategoriesData {
  id: string;
  name: string;
  slug: string;
}

interface ILocationCategoriesRequest extends IGlobalMetaRequest {
  excludeIds: string[] | null;
}

interface ILocationCategoriesResponse {
  locationCategories: GResponse<ILocationCategoriesData>;
}

export const useReadAllLocationCategory = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: Partial<ILocationCategoriesRequest>;
  onCompleted?: (data: ILocationCategoriesResponse) => void;
  skip?: boolean;
}) => {
  const { data: locationCategoriesdata, loading: locationCategoriesLoading } =
    useQuery<ILocationCategoriesResponse, Partial<ILocationCategoriesRequest>>(
      READ_ALL_LOCATION_CATEGORY,
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
    locationCategoriesdata: locationCategoriesdata?.locationCategories.data,
    locationCategoriesMeta: locationCategoriesdata?.locationCategories.meta,
    locationCategoriesLoading,
  };
};
