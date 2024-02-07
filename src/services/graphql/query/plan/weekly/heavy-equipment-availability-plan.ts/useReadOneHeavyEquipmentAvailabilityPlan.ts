import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ONE_HEAVY_EQUIPMENT_AVAILABILITY_PLAN = gql`
  query ReadOneHeavyEquipmentAvailabilityPlan(
    $weeklyPlanId: String!
    $page: Int
    $limit: Int
  ) {
    weeklyHeavyEquipmentAvailabilityPlans(
      findAllHeavyEquipmentAvailabilityPlanInput: {
        weeklyPlanId: $weeklyPlanId
        page: $page
        limit: $limit
      }
    ) {
      meta {
        currentPage
        totalAllData
        totalData
        totalPage
      }
      data {
        id
        class {
          id
          name
        }
        totalCount
        damagedCount
        withoutOperatorCount
        readyCount
        desc
      }
    }
  }
`;

export interface IReadOneHeavyEquipmentAvailabilityPlanData {
  id: string | null;
  class: {
    id: string;
    name: string;
  };
  totalCount: number | null;
  damagedCount: number | null;
  withoutOperatorCount: number | null;
  readyCount: number | null;
  desc: string | null;
}

interface IReadOneHeavyEquipmentAvailabilityPlanResponse {
  weeklyHeavyEquipmentAvailabilityPlans: GResponse<IReadOneHeavyEquipmentAvailabilityPlanData>;
}

interface IReadOneHeavyEquipmentAvailabilityPlanRequest
  extends Partial<IGlobalMetaRequest> {
  weeklyPlanId: string;
}

export const useReadOneHeavyEquipmentAvailabilityPlan = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: IReadOneHeavyEquipmentAvailabilityPlanRequest;
  skip?: boolean;
  onCompleted?: (data: IReadOneHeavyEquipmentAvailabilityPlanResponse) => void;
}) => {
  const {
    data: weeklyHeavyEquipmentAvailabilityPlanData,
    loading: weeklyHeavyEquipmentAvailabilityPlanDataLoading,
  } = useQuery<
    IReadOneHeavyEquipmentAvailabilityPlanResponse,
    IReadOneHeavyEquipmentAvailabilityPlanRequest
  >(READ_ONE_HEAVY_EQUIPMENT_AVAILABILITY_PLAN, {
    variables,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted: onCompleted,
    skip,
    fetchPolicy: 'cache-and-network',
  });

  return {
    weeklyHeavyEquipmentAvailabilityPlanData:
      weeklyHeavyEquipmentAvailabilityPlanData
        ?.weeklyHeavyEquipmentAvailabilityPlans.data,
    weeklyHeavyEquipmentReqPlanMeta:
      weeklyHeavyEquipmentAvailabilityPlanData
        ?.weeklyHeavyEquipmentAvailabilityPlans.meta,
    weeklyHeavyEquipmentAvailabilityPlanDataLoading,
  };
};
