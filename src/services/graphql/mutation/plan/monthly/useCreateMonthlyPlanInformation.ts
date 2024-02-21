import { ApolloError, gql, useMutation } from '@apollo/client';

export const CREATE_MONTHLY_PLAN_INFORMATION = gql`
  mutation CreateMonthlyPlanInformation(
    $companyId: String
    $year: Float
    $month: Float
  ) {
    createMonthlyPlan(
      createMonthlyPlanInput: {
        companyId: $companyId
        year: $year
        month: $month
      }
    ) {
      id
    }
  }
`;

export interface ICreateMonthlyPlanInformationValues<T = string> {
  companyId: string | null;
  year: T | null;
  month: T | null;
}

type ICreateMonthlyPlanInformationRequest =
  ICreateMonthlyPlanInformationValues<number>;

interface ICreateMonthlyPlanInformationResponse {
  createMonthlyPlan: {
    id: string;
  };
}

export const useCreateMonthlyPlanInformation = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: ICreateMonthlyPlanInformationResponse) => void;
}) => {
  return useMutation<
    ICreateMonthlyPlanInformationResponse,
    ICreateMonthlyPlanInformationRequest
  >(CREATE_MONTHLY_PLAN_INFORMATION, {
    onError,
    onCompleted,
  });
};
