import { ApolloError, gql, useMutation } from '@apollo/client';

export const CREATE_WEEKLY_PLAN = gql`
  mutation CreateWeeklyPlan($companyId: String, $year: Float, $week: Float) {
    createWeeklyPlan(
      createWeeklyPlanInput: { companyId: $companyId, year: $year, week: $week }
    ) {
      id
    }
  }
`;

export interface ICreateWeeklyPlanValues<T = string> {
  companyId: string | null;
  year: T | null;
  week: T | null;
}

type ICreateWeeklyPlanRequest = ICreateWeeklyPlanValues<number>;

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
