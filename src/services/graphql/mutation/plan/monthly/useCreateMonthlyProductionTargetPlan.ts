import { ApolloError, gql, useMutation } from '@apollo/client';

export const CREATE_MONTHLY_PRODUCTION_TARGET_PLAN = gql`
  mutation CreateMonthlyProductionTargetPlan(
    $weeklyPlanId: String
    $productionTargetPlans: [UpdateWeeklyProductionTargetPlanDto!]
  ) {
    updateMonthlyProductionTargetPlanBulk(
      updateMonthlyProductionTargetPlanBulkInput: {
        weeklyPlanId: $weeklyPlanId
        productionTargetPlans: $productionTargetPlans
      }
    ) {
      id
    }
  }
`;

export interface IMonthlyProductionTarget {
  id?: string | null;
  week: number;
  rate: number | null | '';
  ton: number | null | '';
}

export interface IMonthlyProductionTargetPlanData {
  id?: string | null;
  materialId: string | null;
  materialName: string;
  isPerent: boolean;
  index?: number | null;
  weeklyProductionTargets: IMonthlyProductionTarget[];
}

export interface IMonthlyProductionTargetPlanValues {
  productionTargetPlans: IMonthlyProductionTargetPlanData[];
}

type ICreateMonthlyProductionTargetPlanRequest = {
  weeklyPlanId: string;
  productionTargetPlans: Omit<
    IMonthlyProductionTargetPlanData,
    'materialName' | 'isPerent'
  >[];
};

interface ICreateMonthlyProductionTargetPlanResponse {
  updateMonthlyProductionTargetPlanBulk: {
    id: string;
  };
}

export const useCreateMonthlyProductionTargetPlan = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: ICreateMonthlyProductionTargetPlanResponse) => void;
}) => {
  return useMutation<
    ICreateMonthlyProductionTargetPlanResponse,
    ICreateMonthlyProductionTargetPlanRequest
  >(CREATE_MONTHLY_PRODUCTION_TARGET_PLAN, {
    onError,
    onCompleted,
  });
};
