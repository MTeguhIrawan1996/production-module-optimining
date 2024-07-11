import { ApolloError, gql, useMutation } from '@apollo/client';

export const DELETE_BARGING_DOME_PLAN = gql`
  mutation DeleteBargingDomePlan($weeklyPlanId: String, $domeId: String) {
    weeklyBargingPlanDeleteDome(
      weeklyBargingPlanDeleteDomeDto: {
        weeklyPlanId: $weeklyPlanId
        domeId: $domeId
      }
    )
  }
`;

export interface IDeleteWeeklyPlanRequest {
  weeklyPlanId: string;
  domeId: string;
}

interface IDeleteWeeklyPlanResponse {
  weeklyBargingPlanDeleteDome: boolean;
}

export const useDeleteBargingDomePlan = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IDeleteWeeklyPlanResponse) => void;
}) => {
  return useMutation<IDeleteWeeklyPlanResponse, IDeleteWeeklyPlanRequest>(
    DELETE_BARGING_DOME_PLAN,
    {
      onError,
      onCompleted,
    }
  );
};
