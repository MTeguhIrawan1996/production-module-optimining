import { ApolloError, gql, useMutation } from '@apollo/client';

import { IUpdateStatusValues } from '@/types/global';

export const UPDATE_ISVALID_MONTHLY_PLAN = gql`
  mutation UpdateIsValidateMonthlyPlan(
    $id: String!
    $status: Boolean
    $statusMessage: String
  ) {
    validateMonthlyPlan(
      validateMonthlyPlanInput: {
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

export interface IUpdateIsValidateMonthlyPlanRequest
  extends IUpdateStatusValues {
  id: string;
  status: boolean;
}

interface IUpdateIsValidateMonthlyPlanResponse {
  validateMonthlyPlan: {
    id: string;
    status: {
      id: string;
    };
  };
}

export const useUpdateIsValidateMonthlyPlan = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateIsValidateMonthlyPlanResponse) => void;
}) => {
  return useMutation<
    IUpdateIsValidateMonthlyPlanResponse,
    IUpdateIsValidateMonthlyPlanRequest
  >(UPDATE_ISVALID_MONTHLY_PLAN, {
    onError,
    onCompleted,
  });
};
