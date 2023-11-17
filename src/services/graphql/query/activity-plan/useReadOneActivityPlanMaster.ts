import { ApolloError, gql, useQuery } from '@apollo/client';

export const READ_ONE_ACTIVITY_PLAN_MASTER = gql`
  query ReadOneActivityPlanMaster($id: String!) {
    activityPlan(id: $id) {
      id
      name
    }
  }
`;

export interface IReadOneActivityPlanMaster {
  id: string;
  name: string;
}

export interface IReadOneActivityPlanMasterResponse {
  activityPlan: IReadOneActivityPlanMaster;
}

export interface IReadOneActivityPlanMasterRequest {
  id: string;
}

export const useReadOneActivityPlanMaster = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: IReadOneActivityPlanMasterRequest;
  skip?: boolean;
  onCompleted?: (data: IReadOneActivityPlanMasterResponse) => void;
}) => {
  const { data: activityPlanMaster, loading: activityPlanMasterLoading } =
    useQuery<
      IReadOneActivityPlanMasterResponse,
      IReadOneActivityPlanMasterRequest
    >(READ_ONE_ACTIVITY_PLAN_MASTER, {
      variables,
      onError: (err: ApolloError) => {
        return err;
      },
      onCompleted: onCompleted,
      skip,
      fetchPolicy: 'cache-and-network',
    });

  return {
    activityPlanMaster: activityPlanMaster?.activityPlan,
    activityPlanMasterLoading,
  };
};
