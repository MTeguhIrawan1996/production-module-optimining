import { ApolloError, gql, useQuery } from '@apollo/client';

import { IGlobalMetaRequest } from '@/types/global';

export const READ_ONE_BARGING_TARGET_PLAN = gql`
  query ReadOneBargingTargetPlan($weeklyPlanId: String!) {
    weeklyBargingPlan(weeklyPlanId: $weeklyPlanId) {
      id
      bargingTargetPlans {
        id
        material {
          id
          name
        }
        weeklyBargingTargets {
          id
          day
          rate
          ton
        }
      }
    }
  }
`;

export interface IReadOneWeeklyBargingTargetData {
  id: string;
  day: number;
  rate: number | null;
  ton: number | null;
}

export interface IReadOneBargingtargetPlanData {
  id: string;
  material: {
    id: string;
    name: string;
  };
  weeklyBargingTargets: IReadOneWeeklyBargingTargetData[];
}

interface IReadOneBargingTargetPlanResponse {
  weeklyBargingPlan: {
    id: string;
    bargingTargetPlans: IReadOneBargingtargetPlanData[];
  } | null;
}

interface IReadOneBargingTargetPlanRequest extends Partial<IGlobalMetaRequest> {
  weeklyPlanId: string;
}

export const useReadOneBargingTargetPlan = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: IReadOneBargingTargetPlanRequest;
  skip?: boolean;
  onCompleted?: (data: IReadOneBargingTargetPlanResponse) => void;
}) => {
  const {
    data: weeklyBargingTargetPlanData,
    loading: weeklyBargingTargetPlanDataLoading,
  } = useQuery<
    IReadOneBargingTargetPlanResponse,
    IReadOneBargingTargetPlanRequest
  >(READ_ONE_BARGING_TARGET_PLAN, {
    variables,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted: onCompleted,
    skip,
    fetchPolicy: 'cache-and-network',
  });

  return {
    weeklyBargingTargetPlanData: weeklyBargingTargetPlanData?.weeklyBargingPlan,
    weeklyBargingTargetPlanDataLoading,
  };
};
