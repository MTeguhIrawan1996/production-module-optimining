import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ONE_BARGING_DOME_PLAN = gql`
  query ReadOneBargingDomePlan(
    $weeklyPlanId: String!
    $page: Int
    $limit: Int
    $orderBy: String
    $orderDir: String
  ) {
    weeklyBargingPlan(weeklyPlanId: $weeklyPlanId) {
      id
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

interface IReadOneBargingDomePlanResponse {
  weeklyBargingPlan: {
    id: string;
    bargingDomePlans: GResponse<IReadOneBargingDomePlanData>;
  } | null;
}

interface IReadOneBargingDomePlanRequest extends Partial<IGlobalMetaRequest> {
  weeklyPlanId: string;
}

export const useReadOneBargingDomePlan = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: IReadOneBargingDomePlanRequest;
  skip?: boolean;
  onCompleted?: (data: IReadOneBargingDomePlanResponse) => void;
}) => {
  const {
    data: weeklyBargingDomePlanData,
    loading: weeklyBargingDomePlanDataLoading,
    refetch,
  } = useQuery<IReadOneBargingDomePlanResponse, IReadOneBargingDomePlanRequest>(
    READ_ONE_BARGING_DOME_PLAN,
    {
      variables,
      onError: (err: ApolloError) => {
        return err;
      },
      onCompleted: onCompleted,
      skip,
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
    }
  );

  return {
    weeklyBargingDomePlanData:
      weeklyBargingDomePlanData?.weeklyBargingPlan?.bargingDomePlans.data,
    weeklyBargingDomePlanMeta:
      weeklyBargingDomePlanData?.weeklyBargingPlan?.bargingDomePlans.meta,
    weeklyBargingDomePlanDataLoading,
    refatchWeeklyBargingDomePlanData: refetch,
  };
};
