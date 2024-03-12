import {
  ApolloError,
  gql,
  useQuery,
  WatchQueryFetchPolicy,
} from '@apollo/client';

import { simpleOtherColumn } from '@/utils/helper/simpleOtherColumn';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_ACTIVITY_CATEGORY_MASTER = gql`
  query ReadAllActivityCategory(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
    $types: [String!]
  ) {
    workingHourPlanCategories(
      findAllWorkingHourPlanCategoryInput: {
        page: $page
        limit: $limit
        search: $search
        orderBy: $orderBy
        orderDir: $orderDir
        types: $types
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
        type
      }
    }
  }
`;

export interface IReadAllActivityCategoryData {
  id: string;
  name: string;
  type: string;
}

interface IReadAllActivityCategoryResponse {
  workingHourPlanCategories: GResponse<IReadAllActivityCategoryData>;
}

export type ITypes = 'default' | 'count_formula' | 'system';

interface IReadAllActivityCategoryRequest extends IGlobalMetaRequest {
  types: ITypes[] | null;
}

interface ISimpleKeyType {
  id: string;
  category: string | null;
}

export const useReadAllActivityCategory = ({
  variables,
  onCompleted,
  skip,
  fetchPolicy = 'cache-first',
}: {
  variables?: Partial<IReadAllActivityCategoryRequest>;
  onCompleted?: (data: IReadAllActivityCategoryResponse) => void;
  skip?: boolean;
  fetchPolicy?: WatchQueryFetchPolicy;
}) => {
  const {
    data: readAllActivityCategoryData,
    loading: readAllActivityCategoryDataLoading,
    refetch,
  } = useQuery<
    IReadAllActivityCategoryResponse,
    Partial<IReadAllActivityCategoryRequest>
  >(READ_ALL_ACTIVITY_CATEGORY_MASTER, {
    variables: variables,
    skip: skip,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted,
    fetchPolicy,
  });

  const simplifiedData: ISimpleKeyType[] | undefined =
    readAllActivityCategoryData?.workingHourPlanCategories.data.map((item) => ({
      id: item.id,
      category: item.name ?? null,
    }));
  const excludeAccessor = ['id'];

  const otherColumn = simpleOtherColumn({
    data: simplifiedData,
    exclude: excludeAccessor,
  });

  return {
    readAllActivityCategoryData: simplifiedData,
    readAllActivityCategoryDataPure:
      readAllActivityCategoryData?.workingHourPlanCategories.data,
    readAllActivityCategoryDataColumn: otherColumn,
    readAllActivityCategoryDataMeta:
      readAllActivityCategoryData?.workingHourPlanCategories.meta,
    readAllActivityCategoryDataLoading,
    refetchReadAllActivityCategoryData: refetch,
  };
};
