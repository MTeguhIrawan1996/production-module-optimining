import { ApolloError, gql, useQuery } from '@apollo/client';

import { simpleOtherColumn } from '@/utils/helper/simpleOtherColumn';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_ACTIVITY_CATEGORY_MASTER = gql`
  query ReadAllActivityCategory(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
    $type: String
  ) {
    workingHourPlanCategories(
      findAllWorkingHourPlanCategoryInput: {
        page: $page
        limit: $limit
        search: $search
        orderBy: $orderBy
        orderDir: $orderDir
        type: $type
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

interface IReadAllActivityCategoryRequest extends IGlobalMetaRequest {
  type: 'default' | 'count_formula' | null;
}

interface ISimpleKeyType {
  id: string;
  category: string | null;
}

export const useReadAllActivityCategory = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: Partial<IReadAllActivityCategoryRequest>;
  onCompleted?: (data: IReadAllActivityCategoryResponse) => void;
  skip?: boolean;
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
    fetchPolicy: 'cache-and-network',
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
    readAllActivityCategoryDataColumn: otherColumn,
    readAllActivityCategoryDataMeta:
      readAllActivityCategoryData?.workingHourPlanCategories.meta,
    readAllActivityCategoryDataLoading,
    refetchReadAllActivityCategoryData: refetch,
  };
};
