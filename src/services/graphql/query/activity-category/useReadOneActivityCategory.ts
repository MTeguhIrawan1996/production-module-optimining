import { ApolloError, gql, useQuery } from '@apollo/client';

import { simpleOtherColumn } from '@/utils/helper/simpleOtherColumn';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ONE_ACTIVITY_CATEGORY_MASTER = gql`
  query ReadOneActivityCategory(
    $id: String!
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
  ) {
    workingHourPlanCategory(id: $id) {
      id
      name
      type
      countFormula {
        parameters {
          order
          operator
          category {
            name
          }
        }
      }
      activities(
        findAllWorkingHourPlanInput: {
          page: $page
          limit: $limit
          search: $search
          orderBy: $orderBy
          orderDir: $orderDir
        }
      ) {
        meta {
          currentPage
          totalAllData
          totalData
          totalPage
        }
        data {
          id
          activityName
        }
      }
    }
  }
`;

interface ICountFormula {
  order: number;
  operator: string | null;
  category: {
    id: string;
    name: string;
  };
}

interface IActivityDatas {
  id: string;
  activityName: string;
}

export interface IReadOneActivityCategoryData {
  id: string;
  name: string;
  type: string;
  countFormula: {
    parameters: ICountFormula[];
  };
  activities: GResponse<IActivityDatas>;
}

interface IReadOneActivityCategoryResponse {
  workingHourPlanCategory: IReadOneActivityCategoryData;
}

interface IReadOneActivityCategoryRequest extends Partial<IGlobalMetaRequest> {
  id: string;
}

interface ISimpleKeyType {
  id: string;
  activity: string | null;
}

export const useReadOneActivityCategory = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: IReadOneActivityCategoryRequest;
  onCompleted?: (data: IReadOneActivityCategoryResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: readOneActivityCategoryData,
    loading: readOneActivityCategoryDataLoading,
    refetch,
  } = useQuery<
    IReadOneActivityCategoryResponse,
    IReadOneActivityCategoryRequest
  >(READ_ONE_ACTIVITY_CATEGORY_MASTER, {
    variables: variables,
    skip: skip,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted,
    fetchPolicy: 'cache-and-network',
  });

  const simplifiedData: ISimpleKeyType[] | undefined =
    readOneActivityCategoryData?.workingHourPlanCategory.activities.data.map(
      (item) => ({
        id: item.id,
        activity: item.activityName ?? null,
      })
    );
  const excludeAccessor = ['id'];

  const otherColumn = simpleOtherColumn({
    data: simplifiedData,
    exclude: excludeAccessor,
  });

  return {
    readOneActivityCategoryDataPure: readOneActivityCategoryData,
    readOneActivityCategoryData: simplifiedData,
    readOneActivityCategoryDataColumn: otherColumn,
    readOneActivityCategoryDataMeta:
      readOneActivityCategoryData?.workingHourPlanCategory.activities.meta,
    readOneActivityCategoryDataLoading,
    refetchReadOneActivityCategoryData: refetch,
  };
};
