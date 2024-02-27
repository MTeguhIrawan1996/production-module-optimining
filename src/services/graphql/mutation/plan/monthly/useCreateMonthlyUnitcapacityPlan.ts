import { ApolloError, gql, useMutation } from '@apollo/client';

export const CREATE_MONTHLY_UNIT_CAPACITY_PLAN = gql`
  mutation CreateMonthlyUnitCapacityPlan(
    $monthlyPlanId: String
    $unitCapacityPlans: [UpdateMonthlyUnitCapacityPlanDto!]
  ) {
    updateMonthlyUnitCapacityPlanBulk(
      updateMonthlyUnitCapacityPlanBulkInput: {
        monthlyPlanId: $monthlyPlanId
        unitCapacityPlans: $unitCapacityPlans
      }
    ) {
      id
    }
  }
`;

export interface IMonthlyTargetPlan {
  id?: string | null;
  week: number;
  rate: number | null | '';
  ton: number | null | '';
}

export interface IMonthlyMaterialsGroup {
  id?: string | null;
  materialId: string | null;
  fleet: string;
  classId: string | null;
  frontId: string | null;
  physicalAvailability: number | string | '';
  useOfAvailability: number | string | '';
  effectiveWorkingHour: number | string | '';
  distance: number | string | '';
  dumpTruckCount: number | string | '';
  targetPlans: IMonthlyTargetPlan[];
}

export interface IMonthlyUnitCapacityPlanProps {
  id?: string | null;
  locationIds: string[];
  activityName: string;
  materials: IMonthlyMaterialsGroup[];
}

export interface IMonthlyUnitCapacityPlanValues {
  unitCapacityPlans: IMonthlyUnitCapacityPlanProps[];
}

type ICreateMonthlyUnitCapacityPlanRequest = {
  monthlyPlanId: string;
  unitCapacityPlans: IMonthlyUnitCapacityPlanProps[];
};

interface ICreateMonthlyUnitCapacityPlanResponse {
  updateMonthlyUnitCapacityPlanBulk: {
    id: string;
  };
}

export const useCreateMonthlyUnitCapacityPlan = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: ICreateMonthlyUnitCapacityPlanResponse) => void;
}) => {
  return useMutation<
    ICreateMonthlyUnitCapacityPlanResponse,
    ICreateMonthlyUnitCapacityPlanRequest
  >(CREATE_MONTHLY_UNIT_CAPACITY_PLAN, {
    onError,
    onCompleted,
  });
};
