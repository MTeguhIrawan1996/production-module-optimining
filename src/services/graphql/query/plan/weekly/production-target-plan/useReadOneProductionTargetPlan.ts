import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ONE_PRODUCTION_TARGET_PLAN = gql`
  query ReadOneProductionTargetPlan(
    $weeklyPlanId: String!
    $page: Int
    $limit: Int
    $orderBy: String
    $orderDir: String
  ) {
    weeklyProductionTargetPlans(
      findAllProductionTargetPlanInput: {
        page: $page
        limit: $limit
        orderBy: $orderBy
        orderDir: $orderDir
        weeklyPlanId: $weeklyPlanId
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
        material {
          id
          name
          parent {
            id
            name
          }
        }
        weeklyProductionTargets {
          id
          day
          rate
          ton
        }
      }
      additional
    }
  }
`;

export interface IReadOneWeeklyProductionTargetData {
  id: string;
  day: number;
  rate: number | null;
  ton: number | null;
}

export interface IReadOneProductiontargetPlanData {
  id: string;
  material: {
    id: string;
    name: string;
    parent: {
      id: string;
      name: string;
    } | null;
  };
  weeklyProductionTargets: IReadOneWeeklyProductionTargetData[];
}

interface IReadOneProductiontargetPlanAdditional {
  parentMaterialsSum: {
    material: {
      id: string;
      name: string;
    };
    weeklyProductionTargets: Omit<IReadOneWeeklyProductionTargetData, 'id'>[];
  }[];
  strippingRatio: Omit<IReadOneWeeklyProductionTargetData, 'id'>[];
}

interface IReadOneProductionTargetPlanResponse {
  weeklyProductionTargetPlans: {
    additional: IReadOneProductiontargetPlanAdditional;
  } & GResponse<IReadOneProductiontargetPlanData>;
}

interface IReadOneProductionTargetPlanRequest
  extends Partial<IGlobalMetaRequest> {
  weeklyPlanId: string;
}

export const useReadOneProductionTargetPlan = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: IReadOneProductionTargetPlanRequest;
  skip?: boolean;
  onCompleted?: (data: IReadOneProductionTargetPlanResponse) => void;
}) => {
  const {
    data: weeklyProductionTargetPlanData,
    loading: weeklyProductionTargetPlanDataLoading,
  } = useQuery<
    IReadOneProductionTargetPlanResponse,
    IReadOneProductionTargetPlanRequest
  >(READ_ONE_PRODUCTION_TARGET_PLAN, {
    variables,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted: onCompleted,
    skip,
    fetchPolicy: 'cache-and-network',
  });

  return {
    weeklyProductionTargetPlanData:
      weeklyProductionTargetPlanData?.weeklyProductionTargetPlans.data,
    weeklyProductionTargetPlanMeta:
      weeklyProductionTargetPlanData?.weeklyProductionTargetPlans.meta,
    weeklyProductionTargetPlanDataLoading,
  };
};
