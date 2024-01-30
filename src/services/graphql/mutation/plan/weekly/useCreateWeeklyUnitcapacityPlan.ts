import { ApolloError, gql, useMutation } from '@apollo/client';

import { ICreateWeeklyPlanInformationValues } from '@/services/graphql/mutation/plan/weekly/useCreateWeeklyPlanInformation';

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
  id?: string;
  day: number | string | '';
  rate: number | string | '';
  ton: number | string | '';
}

export interface IMaterialsGroup {
  id?: string;
  materialId: string | null;
  fleet: number | string | '';
  classId: string | null;
  frontId: string | null;
  physicalAvailability: number | string | '';
  useOfAvailability: number | string | '';
  effectiveWorkingHour: number | string | '';
  distance: number | string | '';
  dumpTruckCount: number | string | '';
  targetPlans: ITargetPlan[];
}

interface IUnitCapacityPlanProps {
  id?: string;
  locationIds: string[];
  activityName: string;
  materials: IMaterialsGroup[];
}

interface IOtherValueUnitActivityPlan {
  amountFleet?: number | string | '';
  avarageDistance?: number | string | '';
  dumpTruckTotal?: number | string | '';
}

type IMargeUnitCapacityPlan = IUnitCapacityPlanProps &
  IOtherValueUnitActivityPlan;

export interface IUnitCapacityPlanValues
  extends ICreateWeeklyPlanInformationValues<string> {
  unitCapacityPlans: IMargeUnitCapacityPlan[];
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
