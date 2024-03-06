import { ApolloError, gql, useMutation } from '@apollo/client';

import { ICreateWeeklyPlanInformationValues } from '@/services/graphql/mutation/plan/weekly/useCreateWeeklyPlanInformation';

export const UPDATE_WEEKLY_PLAN_INFORMATION = gql`
  mutation UpdateWeeklyPlanInformation(
    $id: String
    $companyId: String
    $year: Float
    $week: Float
  ) {
    updateWeeklyPlan(
      updateWeeklyPlanInput: {
        id: $id
        companyId: $companyId
        year: $year
        week: $week
      }
    ) {
      id
    }
  }
`;

type IUpdateWeeklyPlanInformationRequest = {
  id: string;
} & ICreateWeeklyPlanInformationValues<number>;

interface IUpdateWeeklyPlanInformationResponse {
  updateWeeklyPlan: {
    id: string;
  };
}

export const useUpdateWeeklyPlanInformation = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateWeeklyPlanInformationResponse) => void;
}) => {
  return useMutation<
    IUpdateWeeklyPlanInformationResponse,
    IUpdateWeeklyPlanInformationRequest
  >(UPDATE_WEEKLY_PLAN_INFORMATION, {
    onError,
    onCompleted,
  });
};
