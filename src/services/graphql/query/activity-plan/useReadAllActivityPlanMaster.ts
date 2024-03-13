import {
  ApolloError,
  gql,
  useQuery,
  WatchQueryFetchPolicy,
} from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_ACTIVITY_PLAN_MASTER = gql`
  query ReadAllActivityPlan(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
  ) {
    activityPlans(
      findAllActivityPlanInput: {
        page: $page
        limit: $limit
        search: $search
        orderBy: $orderBy
        orderDir: $orderDir
      }
    ) {
      meta {
        currentPage
        totalPage
        totalData
        totalAllData
      }
      data {
        id
        name
      }
    }
  }
`;

interface IActivityPlansData {
  id: string;
  name: string;
}

interface IActivityPlansResponse {
  activityPlans: GResponse<IActivityPlansData>;
}

export const useReadAllActivityPlanMaster = ({
  variables,
  onCompleted,
  skip,
  fetchPolicy = 'cache-first',
}: {
  variables?: Partial<IGlobalMetaRequest>;
  onCompleted?: (data: IActivityPlansResponse) => void;
  skip?: boolean;
  fetchPolicy?: WatchQueryFetchPolicy;
}) => {
  const {
    data: activityPlansData,
    loading: activityPlansDataLoading,
    refetch,
  } = useQuery<IActivityPlansResponse, Partial<IGlobalMetaRequest>>(
    READ_ALL_ACTIVITY_PLAN_MASTER,
    {
      variables: variables,
      skip: skip,
      onError: (err: ApolloError) => {
        return err;
      },
      onCompleted,
      fetchPolicy,
    }
  );

  return {
    activityPlansData: activityPlansData?.activityPlans.data,
    activityPlansDataMeta: activityPlansData?.activityPlans.meta,
    activityPlansDataLoading,
    refetchActivityPlans: refetch,
  };
};
