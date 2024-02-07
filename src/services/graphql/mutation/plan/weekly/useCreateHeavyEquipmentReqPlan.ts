import { ApolloError, gql, useMutation } from '@apollo/client';

export const CREATE_HEAVY_EQUIPMENT_REQ_PLAN = gql`
  mutation CreateHeavyEquipmentReqPlan(
    $weeklyPlanId: String
    $heavyEquipmentRequirementPlans: [UpdateWeeklyHeavyEquipmentRequirementPlanDto!]
  ) {
    updateWeeklyHeavyEquipmentRequirementPlanBulk(
      updateWeeklyHeavyEquipmentRequirementPlanBulkInput: {
        weeklyPlanId: $weeklyPlanId
        heavyEquipmentRequirementPlans: $heavyEquipmentRequirementPlans
      }
    ) {
      id
    }
  }
`;

export interface IWeeklyHeavyEquipmentRequirement {
  id?: string | null;
  day: number;
  value: number | null | '';
}

export interface IMutationHeavyEquipmentReqPlanActivity {
  id?: string | null;
  activityFormId: string | null;
  classId: string | null;
  weeklyHeavyEquipmentRequirements: IWeeklyHeavyEquipmentRequirement[];
}

export interface IMutationHeavyEquipmentReqPlan {
  id?: string | null;
  activityName: string;
  materialIds: string[];
  locationIds: string[];
  averageDistance: number | null | '';
  desc: string;
  activities: IMutationHeavyEquipmentReqPlanActivity[];
}

export interface IMutationHeavyEquipmentReqPlanValues {
  heavyEquipmentRequirementPlans: IMutationHeavyEquipmentReqPlan[];
}

type IMutationHeavyEquipmentReqPlanRequest = {
  weeklyPlanId: string;
  heavyEquipmentRequirementPlans: IMutationHeavyEquipmentReqPlan[];
};

interface IMutationHeavyEquipmentReqPlanResponse {
  updateWeeklyHeavyEquipmentRequirementPlanBulk: {
    id: string;
  };
}

export const useCreateHeavyEquipmentReqPlan = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IMutationHeavyEquipmentReqPlanResponse) => void;
}) => {
  return useMutation<
    IMutationHeavyEquipmentReqPlanResponse,
    IMutationHeavyEquipmentReqPlanRequest
  >(CREATE_HEAVY_EQUIPMENT_REQ_PLAN, {
    onError,
    onCompleted,
  });
};
