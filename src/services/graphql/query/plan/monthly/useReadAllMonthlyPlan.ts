import { ApolloError, gql, useQuery } from '@apollo/client';

import dayjs from '@/utils/helper/dayjs.config';
import { simpleOtherColumn } from '@/utils/helper/simpleOtherColumn';

import { GResponse, IGlobalMetaRequest, IStatus } from '@/types/global';

export const READ_ALL_MONTHLY_PLAN = gql`
  query ReadAllMonthlyPlan(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
    $statusId: String
    $companyId: String
    $year: Float
    $month: Float
  ) {
    monthlyPlans(
      findAllMonthlyPlanInput: {
        page: $page
        limit: $limit
        search: $search
        orderBy: $orderBy
        orderDir: $orderDir
        statusId: $statusId
        companyId: $companyId
        year: $year
        month: $month
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
        month
        status {
          id
          name
          color
        }
      }
    }
  }
`;

export interface IReadAllMonthlyPlanData {
  id: string;
  company: {
    id: string;
    name: string;
  } | null;
  year: number | null;
  month: number | null;
  status: IStatus | null;
}

interface IReadAllMonthlyPlanResponse {
  monthlyPlans: GResponse<IReadAllMonthlyPlanData>;
}

interface IReadAllMonthlyPlanRequest extends IGlobalMetaRequest {
  year: number | null;
  month: number | null;
  companyId: string | null;
  statusId: string | null;
}

interface ISimpleTableKeyValue {
  id: string;
  companyName: string | null;
  year: string | null;
  month: string | null;
  status: IStatus | null;
}

export const useReadAllMonthlyPlan = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: Partial<IReadAllMonthlyPlanRequest>;
  onCompleted?: (data: IReadAllMonthlyPlanResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: monthlyPlanData,
    loading: monthlyPlanDataLoading,
    refetch,
  } = useQuery<
    IReadAllMonthlyPlanResponse,
    Partial<IReadAllMonthlyPlanRequest>
  >(READ_ALL_MONTHLY_PLAN, {
    variables: variables,
    skip: skip,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted,
    fetchPolicy: 'cache-first',
  });

  const simplifiedData: ISimpleTableKeyValue[] | undefined =
    monthlyPlanData?.monthlyPlans.data.map((item) => {
      return {
        id: item.id,
        companyName: item.company?.name ?? null,
        year: `${item.year}`,
        month: item.month
          ? `${dayjs()
              .month(item.month - 1)
              .format('MMMM')}`
          : '-',
        status: item.status,
      };
    });
  const excludeAccessor = ['status', 'id'];

  const otherColumn = simpleOtherColumn({
    data: simplifiedData,
    exclude: excludeAccessor,
  });

  return {
    monthlyPlanData: simplifiedData,
    monthlyPlanDataOtherColumn: otherColumn,
    monthlyPlanDataMeta: monthlyPlanData?.monthlyPlans.meta,
    monthlyPlanDataLoading,
    refetchMonthlyPlanData: refetch,
  };
};
