import { ApolloError, gql, useQuery } from '@apollo/client';

import { IReadAllWeeklyPlanData } from '@/services/graphql/query/plan/weekly/useReadAllWeeklyPlan';

export const READ_ONE_WEEKLY_PLAN = gql`
  query ReadOneWeeklyPlan($id: String!) {
    weeklyPlan(id: $id) {
      id
      company {
        id
        name
      }
      year
      week
      statusMessage
      status {
        id
        name
      }
    }
  }
`;

interface IReadOneWeeklyPlan extends IReadAllWeeklyPlanData {
  statusMessage: string | null;
}

interface IReadOneWeeklyPlanResponse {
  weeklyPlan: IReadOneWeeklyPlan;
}

interface IReadOneWeeklyPlanRequest {
  id: string;
}

export const useReadOneWeeklyPlan = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: IReadOneWeeklyPlanRequest;
  skip?: boolean;
  onCompleted?: (data: IReadOneWeeklyPlanResponse) => void;
}) => {
  const { data: weeklyPlanData, loading: weeklyPlanDataLoading } = useQuery<
    IReadOneWeeklyPlanResponse,
    IReadOneWeeklyPlanRequest
  >(READ_ONE_WEEKLY_PLAN, {
    variables,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted: onCompleted,
    skip,
    fetchPolicy: 'cache-and-network',
  });

  return {
    weeklyPlanData: weeklyPlanData?.weeklyPlan,
    weeklyPlanDataLoading,
  };
};
