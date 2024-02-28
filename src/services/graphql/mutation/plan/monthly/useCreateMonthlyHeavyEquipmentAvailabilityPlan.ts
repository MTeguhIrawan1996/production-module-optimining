import { ApolloError, gql, useMutation } from '@apollo/client';

export const CREATE_MONTHLY_HEAVY_EQUIPMENT_AVAILABILITY_PLAN = gql`
  mutation CreateMonthlyHeavyEquipmentAvailabilityPlan(
    $weeklyPlanId: String
    $heavyEquipmentAvailabilityPlans: [UpdateHeavyEquipmentAvailabilityPlanDto!]
  ) {
    updateMonthlyHeavyEquipmentAvailabilityPlanBulk(
      updateMonthlyHeavyEquipmentAvailabilityPlanBulkInput: {
        weeklyPlanId: $weeklyPlanId
        heavyEquipmentAvailabilityPlans: $heavyEquipmentAvailabilityPlans
      }
    ) {
      id
    }
  }
`;

export interface IMutationMonthlyHeavyEquipmentAvailabilityPlanData {
  id?: string | null;
  classId: string | null;
  totalCount: number | null | '';
  damagedCount: number | null | '';
  withoutOperatorCount: number | null | '';
  desc: string;
}

export interface IMutationMonthlyHeavyEquipmentAvailabilityPlanValues {
  heavyEquipmentAvailabilityPlans: IMutationMonthlyHeavyEquipmentAvailabilityPlanData[];
}

type IMutationMonthlyHeavyEquipmentAvailabilityPlanRequest = {
  weeklyPlanId: string;
  heavyEquipmentAvailabilityPlans: IMutationMonthlyHeavyEquipmentAvailabilityPlanData[];
};

interface IMutationMonthlyHeavyEquipmentAvailabilityPlanResponse {
  updateMonthlyHeavyEquipmentAvailabilityPlanBulk: {
    id: string;
  };
}

export const useCreateMonthlyHeavyEquipmentAvailabilityPlan = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (
    data: IMutationMonthlyHeavyEquipmentAvailabilityPlanResponse
  ) => void;
}) => {
  return useMutation<
    IMutationMonthlyHeavyEquipmentAvailabilityPlanResponse,
    IMutationMonthlyHeavyEquipmentAvailabilityPlanRequest
  >(CREATE_MONTHLY_HEAVY_EQUIPMENT_AVAILABILITY_PLAN, {
    onError,
    onCompleted,
  });
};
