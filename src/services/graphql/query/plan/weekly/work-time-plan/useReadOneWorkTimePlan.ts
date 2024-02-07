import { ApolloError, gql, useQuery } from '@apollo/client';

import { IWorkTimeDay } from '@/services/graphql/mutation/plan/weekly/useCreateWeeklyWorkTimePlan';

export const READ_ONE_WORK_TIME_PLAN = gql`
  query ReadOneWorkTimePlan($weeklyPlanId: String!) {
    weeklyWorkTimePlan(weeklyPlanId: $weeklyPlanId) {
      id
      workTimePlanActivities {
        id
        activity {
          id
          name
        }
        loseTime {
          id
          activityName
        }
        weeklyWorkTimes {
          id
          day
          hour
        }
        totalWeeklyWorkTimes
      }
    }
  }
`;

export interface IReadOneWorkTimePlan {
  id: string;
  workTimePlanActivities: {
    id: string;
    activity: {
      id: string;
      name: string;
    } | null;
    loseTime: {
      id: string;
      activityName: string;
    } | null;
    weeklyWorkTimes: IWorkTimeDay[];
    totalWeeklyWorkTimes: number;
  }[];
}

interface IReadOneWorkTimePlanResponse {
  weeklyWorkTimePlan: IReadOneWorkTimePlan | null;
}

interface IReadOneWorkTimePlanRequest {
  weeklyPlanId: string;
}

export const useReadOneWorkTimePlan = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: IReadOneWorkTimePlanRequest;
  skip?: boolean;
  onCompleted?: (data: IReadOneWorkTimePlanResponse) => void;
}) => {
  const { data: weeklyWorkTimePlan, loading: weeklyWorkTimePlanLoading } =
    useQuery<IReadOneWorkTimePlanResponse, IReadOneWorkTimePlanRequest>(
      READ_ONE_WORK_TIME_PLAN,
      {
        variables,
        onError: (err: ApolloError) => {
          return err;
        },
        onCompleted: onCompleted,
        skip,
        fetchPolicy: 'cache-and-network',
      }
    );

  return {
    weeklyWorkTimePlan: weeklyWorkTimePlan?.weeklyWorkTimePlan,

    weeklyWorkTimePlanLoading,
  };
};
