import { ApolloError, gql, useMutation } from '@apollo/client';

import { ICreateMonthlyPlanInformationValues } from '@/services/graphql/mutation/plan/monthly/useCreateMonthlyPlanInformation';

export const UPDATE_MONTHLY_PLAN_INFORMATION = gql`
  mutation UpdateMonthlyPlanInformation(
    $id: String
    $companyId: String
    $year: Float
    $month: Float
  ) {
    updateMonthlyPlan(
      updateMonthlyPlanInput: {
        id: $id
        companyId: $companyId
        year: $year
        month: $month
      }
    ) {
      id
    }
  }
`;

type IUpdateMonthlyPlanInformationRequest = {
  id: string;
} & ICreateMonthlyPlanInformationValues<number>;

interface IUpdateMonthlyPlanInformationResponse {
  updateMonthlyPlan: {
    id: string;
  };
}

export const useUpdateMonthlyPlanInformation = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateMonthlyPlanInformationResponse) => void;
}) => {
  return useMutation<
    IUpdateMonthlyPlanInformationResponse,
    IUpdateMonthlyPlanInformationRequest
  >(UPDATE_MONTHLY_PLAN_INFORMATION, {
    onError,
    onCompleted,
  });
};
