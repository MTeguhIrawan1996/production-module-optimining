import { ApolloError, gql, useMutation } from '@apollo/client';

export const CREATE_WEEKLY_PLAN = gql`
  mutation CreateWeeklyPlan($companyId: String, $year: String, $week: String) {
    createWeeklyPlan(
      createWeeklyPlanInput: { companyId: $companyId, year: $year, week: $week }
    ) {
      id
    }
  }
`;

export interface ICreateWeeklyPlanValues {
  companyId: string | null;
  year: number | null;
  week: number | null;
}

type ICreateWeeklyPlanRequest = ICreateWeeklyPlanValues;

interface ICreateWeeklyPlanResponse {
  createWeeklyPlan: {
    id: string;
  };
}

export const useCreateWeeklyPlan = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: ICreateWeeklyPlanResponse) => void;
}) => {
  return useMutation<ICreateWeeklyPlanResponse, ICreateWeeklyPlanRequest>(
    CREATE_WEEKLY_PLAN,
    {
      onError,
      onCompleted,
    }
  );
};
