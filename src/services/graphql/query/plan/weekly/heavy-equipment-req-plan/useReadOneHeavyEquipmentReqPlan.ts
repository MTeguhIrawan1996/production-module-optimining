import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ONE_HEAVY_EQUIPMENT_REQ_PLAN = gql`
  query ReadOneHeavyEquipmentReqPlan(
    $weeklyPlanId: String!
    $page: Int
    $limit: Int
  ) {
    weeklyHeavyEquipmentRequirementPlans(
      findAllHeavyEquipmentRequirementPlanInput: {
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
        activityName
        materials {
          id
          name
        }
        locations {
          id
          name
        }
        averageDistance
        activityType {
          id
          name
        }
        desc
        heavyEquipmentRequirementPlanActivities {
          id
          activity {
            id
            name
          }
          class {
            id
            name
          }
          weeklyHeavyEquipmentRequirements {
            id
            day
            value
          }
        }
      }
    }
  }
`;

export interface IWeeklyHeavyEquipmentRequirement {
  id: string | null;
  day: number;
  value: number | null;
}

export interface IHeavyEquipmentRequirementPlanActivity {
  id: string | null;
  activity: {
    id: string;
    name: string;
  };
  class: {
    id: string;
    name: string;
  };
  weeklyHeavyEquipmentRequirements: IWeeklyHeavyEquipmentRequirement[];
}

export interface IReadOneHeavyEquipmentReqPlan {
  id: string | null;
  activityName: string;
  materials: {
    id: string;
    name: string;
  }[];
  locations: {
    id: string;
    name: string;
  }[];
  averageDistance: number | null | '';
  activityType: {
    id: string;
    name: string;
  };
  desc: string;
  heavyEquipmentRequirementPlanActivities: IHeavyEquipmentRequirementPlanActivity[];
}

interface IReadOneHeavyEquipmentReqPlanResponse {
  weeklyHeavyEquipmentRequirementPlans: GResponse<IReadOneHeavyEquipmentReqPlan>;
}

interface IReadOneHeavyEquipmentReqPlanRequest
  extends Partial<IGlobalMetaRequest> {
  weeklyPlanId: string;
}

export const useReadOneHeavyEquipmentReqPlan = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: IReadOneHeavyEquipmentReqPlanRequest;
  skip?: boolean;
  onCompleted?: (data: IReadOneHeavyEquipmentReqPlanResponse) => void;
}) => {
  const {
    data: weeklyHeavyEquipmentReqPlanData,
    loading: weeklyHeavyEquipmentReqPlanDataLoading,
  } = useQuery<
    IReadOneHeavyEquipmentReqPlanResponse,
    IReadOneHeavyEquipmentReqPlanRequest
  >(READ_ONE_HEAVY_EQUIPMENT_REQ_PLAN, {
    variables,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted: onCompleted,
    skip,
    fetchPolicy: 'cache-and-network',
  });

  return {
    weeklyHeavyEquipmentReqPlanData:
      weeklyHeavyEquipmentReqPlanData?.weeklyHeavyEquipmentRequirementPlans
        .data,
    weeklyHeavyEquipmentReqPlanMeta:
      weeklyHeavyEquipmentReqPlanData?.weeklyHeavyEquipmentRequirementPlans
        .meta,
    weeklyHeavyEquipmentReqPlanDataLoading,
  };
};
