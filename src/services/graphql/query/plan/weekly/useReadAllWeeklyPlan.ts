import { ApolloError, gql, useQuery } from '@apollo/client';
import { t } from 'i18next';

import { simpleOtherColumn } from '@/utils/helper/simpleOtherColumn';

import { GResponse, IGlobalMetaRequest, IStatus } from '@/types/global';

export const READ_ALL_WEEKLY_PLAN = gql`
  query ReadAllWeeklyPlan(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
    $statusId: String
    $companyId: String
    $year: Float
    $week: Float
  ) {
    weeklyPlans(
      findAllWeeklyPlanInput: {
        page: $page
        limit: $limit
        search: $search
        orderBy: $orderBy
        orderDir: $orderDir
        statusId: $statusId
        companyId: $companyId
        year: $year
        week: $week
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
        company {
          id
          name
        }
        year
        week
        status {
          id
          name
          color
        }
      }
    }
  }
`;

export interface IReadAllWeeklyPlanData {
  id: string;
  company: {
    id: string;
    name: string;
  } | null;
  year: number | null;
  week: number | null;
  status: IStatus | null;
}

interface IReadAllWeeklyPlanResponse {
  weeklyPlans: GResponse<IReadAllWeeklyPlanData>;
}

interface IReadAllWeeklyPlanRequest extends IGlobalMetaRequest {
  year: number | null;
  week: number | null;
  companyId: string | null;
  statusId: string | null;
}

interface ISimpleTableKeyValue {
  id: string;
  companyName: string | null;
  year: string | null;
  week: string | null;
  status: IStatus | null;
}

export const useReadAllWeeklyPlan = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: Partial<IReadAllWeeklyPlanRequest>;
  onCompleted?: (data: IReadAllWeeklyPlanResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: weeklyPlanData,
    loading: weeklyPlanDataLoading,
    refetch,
  } = useQuery<IReadAllWeeklyPlanResponse, Partial<IReadAllWeeklyPlanRequest>>(
    READ_ALL_WEEKLY_PLAN,
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

  const simplifiedData: ISimpleTableKeyValue[] | undefined =
    weeklyPlanData?.weeklyPlans.data.map((item) => ({
      id: item.id,
      companyName: item.company?.name ?? null,
      year: `${item.year}`,
      week: `${item.week ? t('commonTypography.week') : ''} ${item.week}`,
      status: item.status,
    }));
  const excludeAccessor = ['status', 'id'];

  const otherColumn = simpleOtherColumn({
    data: simplifiedData,
    exclude: excludeAccessor,
  });

  return {
    weeklyPlanData: simplifiedData,
    weeklyPlanDataOtherColumn: otherColumn,
    weeklyPlanDataMeta: weeklyPlanData?.weeklyPlans.meta,
    weeklyPlanDataLoading,
    refetchWeeklyPlanData: refetch,
  };
};
