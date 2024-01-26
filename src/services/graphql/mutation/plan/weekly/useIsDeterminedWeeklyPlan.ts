import { ApolloError, gql, useMutation } from '@apollo/client';

import { IUpdateStatusValues } from '@/types/global';

export const UPDATE_ISDETERMINED_WEEKLY_PLAN = gql`
  mutation UpdateIsDeterminedWeeklyPlan(
    $id: String!
    $status: Boolean
    $statusMessage: String
  ) {
    determineWeeklyPlan(
      determineWeeklyPlanInput: {
        id: $id
        status: $status
        statusMessage: $statusMessage
      }
    ) {
      id
      status {
        id
        name
      }
    }
  }
`;

export interface IUpdateIsDeterminedWeeklyPlanRequest
  extends IUpdateStatusValues {
  id: string;
  status: boolean;
}

interface IUpdateIsDeterminedWeeklyPlanResponse {
  determineWeeklyPlan: {
    id: string;
    status: {
      id: string;
    };
  };
}

export const useUpdateIsDeterminedWeeklyPlan = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateIsDeterminedWeeklyPlanResponse) => void;
}) => {
  return useMutation<
    IUpdateIsDeterminedWeeklyPlanResponse,
    IUpdateIsDeterminedWeeklyPlanRequest
  >(UPDATE_ISDETERMINED_WEEKLY_PLAN, {
    onError,
    onCompleted,
  });
};
