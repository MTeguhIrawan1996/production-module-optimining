import { ApolloError, gql, useMutation } from '@apollo/client';

export const CREATE_WEEKLY_PRODUCTION_TARGET_PLAN = gql`
  mutation CreateWeeklyProductionTargetPlan(
    $weeklyPlanId: String
    $productionTargetPlans: [UpdateWeeklyProductionTargetPlanDto!]
  ) {
    updateWeeklyProductionTargetPlanBulk(
      updateWeeklyProductionTargetPlanBulkInput: {
        weeklyPlanId: $weeklyPlanId
        productionTargetPlans: $productionTargetPlans
      }
    ) {
      id
    }
  }
`;

export interface IWeeklyProductionTarget {
  id?: string | null;
  day: number;
  rate: number | null | '';
  ton: number | null | '';
}

export interface IWeeklyProductionTargetPlanData {
  id?: string | null;
  materialId: string | null;
  materialName: string;
  isPerent: boolean;
  weeklyProductionTargets: IWeeklyProductionTarget[];
}

export interface IWeeklyProductionTargetPlanValues {
  productionTargetPlans: IWeeklyProductionTargetPlanData[];
}

type ICreateWeeklyProductionTargetPlanRequest = {
  weeklyPlanId: string;
  productionTargetPlans: Omit<
    IWeeklyProductionTargetPlanData,
    'materialName' | 'isPerent'
  >[];
};

interface ICreateWeeklyProductionTargetPlanResponse {
  updateWeeklyProductionTargetPlanBulk: {
    id: string;
  };
}

export const useCreateWeeklyProductionTargetPlan = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: ICreateWeeklyProductionTargetPlanResponse) => void;
}) => {
  return useMutation<
    ICreateWeeklyProductionTargetPlanResponse,
    ICreateWeeklyProductionTargetPlanRequest
  >(CREATE_WEEKLY_PRODUCTION_TARGET_PLAN, {
    onError,
    onCompleted,
  });
};
