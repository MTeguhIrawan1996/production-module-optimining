import { ApolloError, gql, useQuery } from '@apollo/client';

import { IReadAllMonthlyPlanData } from '@/services/graphql/query/plan/monthly/useReadAllMonthlyPlan';

export const READ_ONE_MONTHLY_PLAN = gql`
  query ReadOneMonthlyPlan($id: String!) {
    monthlyPlan(id: $id) {
      id
      company {
        id
        name
      }
      year
      month
      statusMessage
      status {
        id
        name
      }
    }
  }
`;

interface IReadOneMonthlyPlan extends IReadAllMonthlyPlanData {
  statusMessage: string | null;
}

interface IReadOneMonthlyPlanResponse {
  monthlyPlan: IReadOneMonthlyPlan;
}

interface IReadOneMonthlyPlanRequest {
  id: string;
}

export const useReadOneMonthlyPlan = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: IReadOneMonthlyPlanRequest;
  skip?: boolean;
  onCompleted?: (data: IReadOneMonthlyPlanResponse) => void;
}) => {
  const { data: monthlyPlanData, loading: monthlyPlanDataLoading } = useQuery<
    IReadOneMonthlyPlanResponse,
    IReadOneMonthlyPlanRequest
  >(READ_ONE_MONTHLY_PLAN, {
    variables,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted: onCompleted,
    skip,
    fetchPolicy: 'cache-and-network',
  });

  return {
    monthlyPlanData: monthlyPlanData?.monthlyPlan,
    monthlyPlanDataLoading,
  };
};
