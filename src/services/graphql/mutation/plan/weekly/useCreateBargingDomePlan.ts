import { ApolloError, gql, useMutation } from '@apollo/client';

export const CREATE_WEEKLY_BARGING_DOME_PLAN = gql`
  mutation CreateWeeklyBargingDomePlan($weeklyPlanId: String, $domeId: String) {
    weeklyBargingPlanAddDome(
      weeklyBargingPlanAddDomeDto: {
        weeklyPlanId: $weeklyPlanId
        domeId: $domeId
      }
    ) {
      id
    }
  }
`;

interface IBargingDomePlanData {
  domeId: string | null;
}

export type IBargingDomePlanValue = IBargingDomePlanData;

type ICreateWeeklyBargingTargetPlanRequest = {
  weeklyPlanId: string;
} & IBargingDomePlanData;

interface ICreateWeeklyBargingTargetPlanResponse {
  weeklyBargingPlanAddDome: {
    id: string;
  };
}

export const useCreateWeeklyBargingDomePlan = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: ICreateWeeklyBargingTargetPlanResponse) => void;
}) => {
  return useMutation<
    ICreateWeeklyBargingTargetPlanResponse,
    ICreateWeeklyBargingTargetPlanRequest
  >(CREATE_WEEKLY_BARGING_DOME_PLAN, {
    onError,
    onCompleted,
  });
};
