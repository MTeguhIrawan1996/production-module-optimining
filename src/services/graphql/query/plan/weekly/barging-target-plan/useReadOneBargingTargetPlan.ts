import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ONE_BARGING_TARGET_PLAN = gql`
  query ReadOneBargingTargetPlan(
    $weeklyPlanId: String!
    $page: Int
    $limit: Int
    $orderBy: String
    $orderDir: String
  ) {
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
      bargingDomePlans(
        findAllBargingDomePlanInput: {
          page: $page
          limit: $limit
          orderBy: $orderBy
          orderDir: $orderDir
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
          dome {
            id
            name
            stockpile {
              id
              name
            }
            monitoringStockpile {
              tonByRitage
              currentTonSurvey
              ritageSamples {
                additional
              }
            }
          }
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

export interface IReadOneBargingDomePlanData {
  id: string;
  dome: {
    id: string;
    name: string;
    stockpile: {
      id: string;
      name: string;
    };
    monitoringStockpile: {
      tonByRitage: number | null;
      currentTonSurvey: number | null;
      ritageSamples: {
        additional: {
          averageSamples: {
            element: {
              id: string;
              name: string | null;
            };
            value: number | null;
          }[];
        };
      };
    };
  };
}

interface IReadOneBargingTargetPlanResponse {
  weeklyBargingPlan: {
    id: string;
    bargingTargetPlans: IReadOneBargingtargetPlanData[];
    bargingDomePlans: GResponse<IReadOneBargingDomePlanData>;
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
