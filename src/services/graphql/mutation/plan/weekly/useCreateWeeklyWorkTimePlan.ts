import { ApolloError, gql, useMutation } from '@apollo/client';

export const CREATE_WEEKLY_WORK_TIME_PLAN = gql`
  mutation CreateWeeklyWorkTimePlan(
    $weeklyPlanId: String
    $workTimePlanActivities: [UpdateWorkTimePlanActivity!]
  ) {
    updateWeeklyWorkTimePlan(
      updateDto: {
        weeklyPlanId: $weeklyPlanId
        workTimePlanActivities: $workTimePlanActivities
      }
    ) {
      id
    }
  }
`;

export interface IWorkTimeDay {
  id?: string | null;
  day: number | string | '';
  hour: number | null | '';
}

export interface IWorkTimePlanActivities {
  id?: string | null;
  isLoseTime: boolean;
  activityId: string | null;
  loseTimeId: string | null;
  name: string;
  weeklyWorkTimes: IWorkTimeDay[];
}

export interface IWorkTimePlanValues {
  workTimePlanActivities: IWorkTimePlanActivities[];
}

type ICreateWeeklyWorkTimePlanRequest = {
  weeklyPlanId: string;
  workTimePlanActivities: Omit<IWorkTimePlanActivities, 'name'>[];
};

interface ICreateWeeklyWorkTimePlanResponse {
  updateWeeklyWorkTimePlan: {
    id: string;
  };
}

export const useCreateWeeklyWorkTimePlan = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: ICreateWeeklyWorkTimePlanResponse) => void;
}) => {
  return useMutation<
    ICreateWeeklyWorkTimePlanResponse,
    ICreateWeeklyWorkTimePlanRequest
  >(CREATE_WEEKLY_WORK_TIME_PLAN, {
    onError,
    onCompleted,
  });
};
