import { ApolloError, gql, useQuery } from '@apollo/client';

import { simpleOtherColumn } from '@/utils/helper/simpleOtherColumn';

import {
  GResponse,
  IGlobalMetaRequest,
  IGroupingDetail,
  IReadFormulaParameter,
} from '@/types/global';

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
          id
          order
          operator
          category {
            id
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

interface IActivityDatas {
  id: string;
  activityName: string;
}

export interface IReadOneActivityCategoryData {
  id: string;
  name: string;
  type: string;
  countFormula: {
    parameters: IReadFormulaParameter[];
  } | null;
  activities: GResponse<IActivityDatas> | null;
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
    readOneActivityCategoryData?.workingHourPlanCategory?.activities?.data.map(
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

  const arrayNameValue =
    readOneActivityCategoryData?.workingHourPlanCategory.activities?.data.map(
      (val) => ({
        name: 'activity',
        value: val.activityName,
      })
    );

  const grouping: IGroupingDetail[] = [
    {
      group: 'category',
      withDivider: false,
      enableTitle: false,
      itemValue: [
        {
          name: 'category',
          value: readOneActivityCategoryData?.workingHourPlanCategory.name,
        },
      ],
    },
    {
      group: 'activity',
      withDivider: false,
      enableTitle: true,
      itemValue: [...(arrayNameValue ?? [])],
    },
  ];

  const valueFormulas =
    readOneActivityCategoryData?.workingHourPlanCategory.countFormula
      ?.parameters;
  const sentence = valueFormulas
    ?.map((item) => `${item.operator ?? ''} ${item.category.name}`)
    .join(' ');

  const groupingCalculation: IGroupingDetail[] = [
    {
      group: 'category',
      withDivider: false,
      enableTitle: false,
      itemValue: [
        {
          name: 'category',
          value: readOneActivityCategoryData?.workingHourPlanCategory.name,
        },
      ],
    },
    {
      group: 'calculation',
      withDivider: false,
      enableTitle: true,
      itemValue: [
        {
          name: 'calculation',
          value: sentence,
        },
      ],
    },
  ];

  return {
    readOneActivityCategoryDataPure: readOneActivityCategoryData,
    readOneActivityCategoryDataGrouping: grouping,
    readOneActivityCategoryDataGroupingCalculation: groupingCalculation,
    readOneActivityCategoryData: simplifiedData,
    readOneActivityCategoryDataColumn: otherColumn,
    readOneActivityCategoryDataMeta:
      readOneActivityCategoryData?.workingHourPlanCategory?.activities?.meta,
    readOneActivityCategoryDataLoading,
    refetchReadOneActivityCategoryData: refetch,
  };
};
