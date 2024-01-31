import { ApolloError, gql, useQuery } from '@apollo/client';

export const READ_ONE_UNIT_CAPACITY_PLAN = gql`
  query ReadOneUnitCapacityPlan($weeklyPlanId: String!) {
    weeklyUnitCapacityPlans(weeklyPlanId: $weeklyPlanId) {
      id
      locations {
        id
        name
      }
      activityName
      materials {
        id
        material {
          id
          name
        }
        fleet
        class {
          id
          name
        }
        front {
          id
          name
        }
        physicalAvailability
        useOfAvailability
        effectiveWorkingHour
        distance
        dumpTruckCount
        targetPlans {
          id
          day
          rate
          ton
        }
      }
    }
  }
`;

interface IReadOneUnitCapacityPlan {
  id: string;
  locations: {
    id: string;
    name: string;
  }[];
  activityName: string;
  materials: {
    id: string;
    material: {
      id: string;
      name: string;
    };
    fleet: number;
    class: {
      id: string;
      name: string;
    };
    front: {
      id: string;
      name: string;
    };
    physicalAvailability: number;
    useOfAvailability: number;
    effectiveWorkingHour: number;
    distance: number;
    dumpTruckCount: number;
    targetPlans: {
      id: string;
      day: number;
      rate: number | null;
      ton: number | null;
    }[];
  }[];
}

interface IReadOneUnitCapacityPlanResponse {
  weeklyUnitCapacityPlans: IReadOneUnitCapacityPlan[];
}

interface IReadOneUnitCapacityPlanRequest {
  weeklyPlanId: string;
}

export const useReadOneUnitCapacityPlan = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: IReadOneUnitCapacityPlanRequest;
  skip?: boolean;
  onCompleted?: (data: IReadOneUnitCapacityPlanResponse) => void;
}) => {
  const {
    data: weeklyUnitCapacityPlanData,
    loading: weeklyUnitCapacityPlanDataLoading,
  } = useQuery<
    IReadOneUnitCapacityPlanResponse,
    IReadOneUnitCapacityPlanRequest
  >(READ_ONE_UNIT_CAPACITY_PLAN, {
    variables,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted: onCompleted,
    skip,
    fetchPolicy: 'cache-and-network',
  });

  return {
    weeklyUnitCapacityPlanData:
      weeklyUnitCapacityPlanData?.weeklyUnitCapacityPlans,
    weeklyUnitCapacityPlanDataLoading,
  };
};
