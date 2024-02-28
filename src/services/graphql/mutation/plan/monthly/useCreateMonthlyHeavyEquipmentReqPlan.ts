import { ApolloError, gql, useMutation } from '@apollo/client';

export const CREATE_MONTHLY_HEAVY_EQUIPMENT_REQ_PLAN = gql`
  mutation CreateMonthlyHeavyEquipmentReqPlan(
    $weeklyPlanId: String
    $heavyEquipmentRequirementPlans: [UpdateWeeklyHeavyEquipmentRequirementPlanDto!]
  ) {
    updateMonthlyHeavyEquipmentRequirementPlanBulk(
      updateMonthlyHeavyEquipmentRequirementPlanBulkInput: {
        weeklyPlanId: $weeklyPlanId
        heavyEquipmentRequirementPlans: $heavyEquipmentRequirementPlans
      }
    ) {
      id
    }
  }
`;

export interface IMutationMonthlyHeavyEquipmentRequirement {
  id?: string | null;
  week: number;
  value: number | null | '';
}

export interface IMutationMonthlyHeavyEquipmentReqPlanActivity {
  id?: string | null;
  activityId: string | null;
  classId: string | null;
  weeklyHeavyEquipmentRequirements: IMutationMonthlyHeavyEquipmentRequirement[];
}

export interface IMutationMonthlyHeavyEquipmentReqPlan {
  id?: string | null;
  activityName: string;
  materialIds: string[];
  locationIds: string[];
  averageDistance: number | null | '';
  desc: string;
  activities: IMutationMonthlyHeavyEquipmentReqPlanActivity[];
}

export interface IMutationMonthlyHeavyEquipmentReqPlanValues {
  heavyEquipmentRequirementPlans: IMutationMonthlyHeavyEquipmentReqPlan[];
}

type IMutationMonthlyHeavyEquipmentReqPlanRequest = {
  weeklyPlanId: string;
  heavyEquipmentRequirementPlans: IMutationMonthlyHeavyEquipmentReqPlan[];
};

interface IMutationMonthlyHeavyEquipmentReqPlanResponse {
  updateMonthlyHeavyEquipmentRequirementPlanBulk: {
    id: string;
  };
}

export const useCreateMonthlyHeavyEquipmentReqPlan = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IMutationMonthlyHeavyEquipmentReqPlanResponse) => void;
}) => {
  return useMutation<
    IMutationMonthlyHeavyEquipmentReqPlanResponse,
    IMutationMonthlyHeavyEquipmentReqPlanRequest
  >(CREATE_MONTHLY_HEAVY_EQUIPMENT_REQ_PLAN, {
    onError,
    onCompleted,
  });
};
