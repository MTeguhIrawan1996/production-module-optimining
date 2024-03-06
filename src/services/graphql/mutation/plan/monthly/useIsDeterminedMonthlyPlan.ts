import { ApolloError, gql, useMutation } from '@apollo/client';

import { IUpdateStatusValues } from '@/types/global';

export const UPDATE_ISDETERMINED_MONTHLY_PLAN = gql`
  mutation UpdateIsDeterminedMonthlyPlan(
    $id: String!
    $status: Boolean
    $statusMessage: String
  ) {
    determineMonthlyPlan(
      determineMonthlyPlanInput: {
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

export interface IUpdateIsDeterminedMonthlyPlanRequest
  extends IUpdateStatusValues {
  id: string;
  status: boolean;
}

interface IUpdateIsDeterminedMonthlyPlanResponse {
  determineMonthlyPlan: {
    id: string;
    status: {
      id: string;
    };
  };
}

export const useUpdateIsDeterminedMonthlyPlan = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateIsDeterminedMonthlyPlanResponse) => void;
}) => {
  return useMutation<
    IUpdateIsDeterminedMonthlyPlanResponse,
    IUpdateIsDeterminedMonthlyPlanRequest
  >(UPDATE_ISDETERMINED_MONTHLY_PLAN, {
    onError,
    onCompleted,
  });
};
