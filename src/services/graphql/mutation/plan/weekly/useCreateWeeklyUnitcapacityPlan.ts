import { ApolloError, gql, useMutation } from '@apollo/client';

export const CREATE_WEEKLY_UNIT_CAPACITY_PLAN = gql`
  mutation CreateWeeklyUnitCapacityPlan(
    $weeklyPlanId: String
    $unitCapacityPlans: [UpdateWeeklyUnitCapacityPlanDto!]
  ) {
    updateWeeklyUnitCapacityPlanBulk(
      updateWeeklyUnitCapacityPlanBulkInput: {
        weeklyPlanId: $weeklyPlanId
        unitCapacityPlans: $unitCapacityPlans
      }
    ) {
      id
    }
  }
`;

export interface ITargetPlan {
  id?: string | null;
  day: number;
  rate: number | null | '';
  ton: number | null | '';
}

export interface IMaterialsGroup {
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
  targetPlans: ITargetPlan[];
}

export interface IUnitCapacityPlanProps {
  id?: string | null;
  locationIds: string[];
  activityName: string;
  materials: IMaterialsGroup[];
}

export interface IUnitCapacityPlanValues {
  unitCapacityPlans: IUnitCapacityPlanProps[];
}

type ICreateWeeklyUnitCapacityPlanRequest = {
  weeklyPlanId: string;
  unitCapacityPlans: IUnitCapacityPlanProps[];
};

interface ICreateWeeklyUnitCapacityPlanResponse {
  updateWeeklyUnitCapacityPlanBulk: {
    id: string;
  };
}

export const useCreateWeeklyUnitCapacityPlan = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: ICreateWeeklyUnitCapacityPlanResponse) => void;
}) => {
  return useMutation<
    ICreateWeeklyUnitCapacityPlanResponse,
    ICreateWeeklyUnitCapacityPlanRequest
  >(CREATE_WEEKLY_UNIT_CAPACITY_PLAN, {
    onError,
    onCompleted,
  });
};
