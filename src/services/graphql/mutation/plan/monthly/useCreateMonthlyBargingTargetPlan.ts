import { ApolloError, gql, useMutation } from '@apollo/client';

export const CREATE_MONTHLY_BARGING_TARGET_PLAN = gql`
  mutation CreateMonthlyBargingTargetPlan(
    $weeklyPlanId: String
    $bargingTargetPlans: [UpdateWeeklyBargingTargetPlan!]
    $bargingDomePlans: [UpdateBargingDomePlan!]
  ) {
    updateMonthlyBargingPlan(
      updateMonthlyBargingPlanDto: {
        weeklyPlanId: $weeklyPlanId
        bargingTargetPlans: $bargingTargetPlans
        bargingDomePlans: $bargingDomePlans
      }
    ) {
      id
    }
  }
`;

export interface IMonthlyBargingTarget {
  id?: string | null;
  week: number;
  rate: number | null | '';
  ton: number | null | '';
}

export interface IMonthlyBargingTargetPlan {
  id?: string | null;
  materialId: string | null;
  materialName?: string;
  weeklyBargingTargets: IMonthlyBargingTarget[];
}

export interface IMonthlyBargingDomePlan {
  id?: string | null;
  domeId: string | null;
}

export interface IMonthlyBargingTargetPlanValue {
  bargingTargetPlans: IMonthlyBargingTargetPlan[];
  bargingDomePlans: IMonthlyBargingDomePlan[];
}

type ICreateMonthlyBargingTargetPlanRequest = {
  weeklyPlanId: string;
  bargingTargetPlans: IMonthlyBargingTargetPlan[];
  bargingDomePlans: IMonthlyBargingDomePlan[];
};

interface ICreateMonthlyBargingTargetPlanResponse {
  updateMonthlyBargingPlan: {
    id: string;
  };
}

export const useCreateMonthlyBargingTargetPlan = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: ICreateMonthlyBargingTargetPlanResponse) => void;
}) => {
  return useMutation<
    ICreateMonthlyBargingTargetPlanResponse,
    ICreateMonthlyBargingTargetPlanRequest
  >(CREATE_MONTHLY_BARGING_TARGET_PLAN, {
    onError,
    onCompleted,
  });
};
