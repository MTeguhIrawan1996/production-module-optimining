import { ApolloError, gql, useMutation } from '@apollo/client';

export const CREATE_HEAVY_EQUIPMENT_AVAILABILITY_PLAN = gql`
  mutation CreateHeavyEquipmentAvailabilityPlan(
    $weeklyPlanId: String
    $heavyEquipmentAvailabilityPlans: [UpdateHeavyEquipmentAvailabilityPlanDto!]
  ) {
    updateWeeklyHeavyEquipmentAvailabilityPlanBulk(
      updateWeeklyHeavyEquipmentAvailabilityPlanBulkInput: {
        weeklyPlanId: $weeklyPlanId
        heavyEquipmentAvailabilityPlans: $heavyEquipmentAvailabilityPlans
      }
    ) {
      id
    }
  }
`;

export interface IMutationHeavyEquipmentAvailabilityPlanData {
  id?: string | null;
  classId: string | null;
  totalCount: number | null | '';
  damagedCount: number | null | '';
  withoutOperatorCount: number | null | '';
  desc: string;
}

export interface IMutationHeavyEquipmentAvailabilityPlanValues {
  heavyEquipmentAvailabilityPlans: IMutationHeavyEquipmentAvailabilityPlanData[];
}

type IMutationHeavyEquipmentAvailabilityPlanRequest = {
  weeklyPlanId: string;
  heavyEquipmentAvailabilityPlans: IMutationHeavyEquipmentAvailabilityPlanData[];
};

interface IMutationHeavyEquipmentAvailabilityPlanResponse {
  updateWeeklyHeavyEquipmentAvailabilityPlanBulk: {
    id: string;
  };
}

export const useCreateHeavyEquipmentAvailabilityPlan = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IMutationHeavyEquipmentAvailabilityPlanResponse) => void;
}) => {
  return useMutation<
    IMutationHeavyEquipmentAvailabilityPlanResponse,
    IMutationHeavyEquipmentAvailabilityPlanRequest
  >(CREATE_HEAVY_EQUIPMENT_AVAILABILITY_PLAN, {
    onError,
    onCompleted,
  });
};
