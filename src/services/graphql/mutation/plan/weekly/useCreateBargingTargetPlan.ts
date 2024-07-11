import { ApolloError, gql, useMutation } from '@apollo/client';

export const CREATE_WEEKLY_BARGING_TARGET_PLAN = gql`
  mutation CreateWeeklyBargingTargetPlan(
    $weeklyPlanId: String
    $bargingTargetPlans: [UpdateWeeklyBargingTargetPlan!]
  ) {
    updateWeeklyBargingPlan(
      updateWeeklyBargingPlanDto: {
        weeklyPlanId: $weeklyPlanId
        bargingTargetPlans: $bargingTargetPlans
      }
    ) {
      id
    }
  }
`;

export interface IWeeklyBargingTarget {
  id?: string | null;
  day: number;
  rate: number | null | '';
  ton: number | null | '';
}

export interface IBargingTargetPlan {
  id?: string | null;
  materialId: string | null;
  materialName?: string;
  weeklyBargingTargets: IWeeklyBargingTarget[];
}

export interface IBargingTargetPlanValue {
  bargingTargetPlans: IBargingTargetPlan[];
}

type ICreateWeeklyBargingTargetPlanRequest = {
  weeklyPlanId: string;
  bargingTargetPlans: IBargingTargetPlan[];
};

interface ICreateWeeklyBargingTargetPlanResponse {
  updateWeeklyBargingPlan: {
    id: string;
  };
}

export const useCreateWeeklyBargingTargetPlan = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: ICreateWeeklyBargingTargetPlanResponse) => void;
}) => {
  return useMutation<
    ICreateWeeklyBargingTargetPlanResponse,
    ICreateWeeklyBargingTargetPlanRequest
  >(CREATE_WEEKLY_BARGING_TARGET_PLAN, {
    onError,
    onCompleted,
  });
};
