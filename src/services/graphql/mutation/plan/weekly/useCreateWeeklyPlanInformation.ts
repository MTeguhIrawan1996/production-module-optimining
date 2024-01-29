import { ApolloError, gql, useMutation } from '@apollo/client';

export const CREATE_WEEKLY_PLAN_INFORMATION = gql`
  mutation CreateWeeklyPlanInformation(
    $companyId: String
    $year: Float
    $week: Float
  ) {
    createWeeklyPlan(
      createWeeklyPlanInput: { companyId: $companyId, year: $year, week: $week }
    ) {
      id
    }
  }
`;

export interface ICreateWeeklyPlanInformationValues<T = string> {
  companyId: string | null;
  year: T | null;
  week: T | null;
}

type ICreateWeeklyPlanInformationRequest =
  ICreateWeeklyPlanInformationValues<number>;

interface ICreateWeeklyPlanInformationResponse {
  createWeeklyPlan: {
    id: string;
  };
}

export const useCreateWeeklyPlanInformation = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: ICreateWeeklyPlanInformationResponse) => void;
}) => {
  return useMutation<
    ICreateWeeklyPlanInformationResponse,
    ICreateWeeklyPlanInformationRequest
  >(CREATE_WEEKLY_PLAN_INFORMATION, {
    onError,
    onCompleted,
  });
};
