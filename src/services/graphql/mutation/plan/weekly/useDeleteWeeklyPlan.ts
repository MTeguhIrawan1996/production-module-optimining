import { ApolloError, gql, useMutation } from '@apollo/client';

export const DELETE_WEEKLY_PLAN = gql`
  mutation DeleteWeeklyPlan($id: String!) {
    deleteWeeklyPlan(id: $id)
  }
`;

export interface IDeleteWeeklyPlanRequest {
  id: string;
}

interface IDeleteWeeklyPlanResponse {
  deleteWeeklyPlan: boolean;
}

export const useDeleteWeeklyPlan = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IDeleteWeeklyPlanResponse) => void;
}) => {
  return useMutation<IDeleteWeeklyPlanResponse, IDeleteWeeklyPlanRequest>(
    DELETE_WEEKLY_PLAN,
    {
      onError,
      onCompleted,
    }
  );
};
