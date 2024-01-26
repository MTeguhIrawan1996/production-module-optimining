import { ApolloError, gql, useMutation } from '@apollo/client';

import { IUpdateStatusValues } from '@/types/global';

export const UPDATE_ISVALID_WEEKLY_PLAN = gql`
  mutation UpdateIsValidateWeeklyPlan(
    $id: String!
    $status: Boolean
    $statusMessage: String
  ) {
    validateWeeklyPlan(
      validateWeeklyPlanInput: {
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

export interface IUpdateIsValidateWeeklyPlanRequest
  extends IUpdateStatusValues {
  id: string;
  status: boolean;
}

interface IUpdateIsValidateWeeklyPlanResponse {
  validateWeeklyPlan: {
    id: string;
    status: {
      id: string;
    };
  };
}

export const useUpdateIsValidateWeeklyPlan = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateIsValidateWeeklyPlanResponse) => void;
}) => {
  return useMutation<
    IUpdateIsValidateWeeklyPlanResponse,
    IUpdateIsValidateWeeklyPlanRequest
  >(UPDATE_ISVALID_WEEKLY_PLAN, {
    onError,
    onCompleted,
  });
};
