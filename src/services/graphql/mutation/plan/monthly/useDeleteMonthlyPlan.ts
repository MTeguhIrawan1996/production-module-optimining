import { ApolloError, gql, useMutation } from '@apollo/client';

export const DELETE_MONTHLY_PLAN = gql`
  mutation DeleteMonthlyPlan($id: String!) {
    deleteMonthlyPlan(id: $id)
  }
`;

export interface IDeleteMonthlyPlanRequest {
  id: string;
}

interface IDeleteMonthlyPlanResponse {
  deleteMonthlyPlan: boolean;
}

export const useDeleteMonthlyPlan = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IDeleteMonthlyPlanResponse) => void;
}) => {
  return useMutation<IDeleteMonthlyPlanResponse, IDeleteMonthlyPlanRequest>(
    DELETE_MONTHLY_PLAN,
    {
      onError,
      onCompleted,
    }
  );
};
