import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IFile, IGlobalMetaRequest } from '@/types/global';

export const READ_ONE_MINING_MAP_PLAN = gql`
  query ReadOneMiningMapPlan(
    $weeklyPlanId: String!
    $page: Int
    $limit: Int
    $orderBy: String
    $orderDir: String
  ) {
    weeklyMiningMapPlans(
      findAllMiningMapPlanInput: {
        weeklyPlanId: $weeklyPlanId
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
        mapName
        locationCategory {
          id
          name
        }
        location {
          id
          name
        }
        type {
          id
          name
        }
        file {
          id
          originalFileName
          url
          fileName
          mime
        }
      }
    }
  }
`;

export interface IReadOneMiningMapPlanData {
  id: string;
  mapName: string;
  locationCategory: {
    id: string;
    name: string;
  };
  location: {
    id: string;
    name: string;
  };
  type: {
    id: string;
    name: string;
  };
  file: Omit<IFile, 'path'>;
}

interface IReadOneMiningMapPlanResponse {
  weeklyMiningMapPlans: GResponse<IReadOneMiningMapPlanData>;
}

interface IReadOneMiningMapPlanRequest extends Partial<IGlobalMetaRequest> {
  weeklyPlanId: string;
}

export const useReadOneMiningMapPlan = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: IReadOneMiningMapPlanRequest;
  skip?: boolean;
  onCompleted?: (data: IReadOneMiningMapPlanResponse) => void;
}) => {
  const { data: weeklyMiningPlanData, loading: weeklyMiningPlanDataLoading } =
    useQuery<IReadOneMiningMapPlanResponse, IReadOneMiningMapPlanRequest>(
      READ_ONE_MINING_MAP_PLAN,
      {
        variables,
        onError: (err: ApolloError) => {
          return err;
        },
        onCompleted: onCompleted,
        skip,
        fetchPolicy: 'cache-and-network',
      }
    );

  return {
    weeklyMiningPlanData: weeklyMiningPlanData?.weeklyMiningMapPlans.data,
    weeklyMiningPlanMeta: weeklyMiningPlanData?.weeklyMiningMapPlans.meta,
    weeklyMiningPlanDataLoading,
  };
};
