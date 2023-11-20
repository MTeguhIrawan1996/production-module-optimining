import { ApolloError, gql, useQuery } from '@apollo/client';

export const READ_ONE_WHP_MASTER = gql`
  query ReadOneWHPMaster($id: String!) {
    workingHourPlan(id: $id) {
      id
      activityName
    }
  }
`;

export interface IReadOneWHPMaster {
  id: string;
  activityName: string;
}

export interface IReadOneWHPMasterResponse {
  workingHourPlan: IReadOneWHPMaster;
}

export interface IReadOneWHPMasterRequest {
  id: string;
}

export const useReadOneWHPMaster = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: IReadOneWHPMasterRequest;
  skip?: boolean;
  onCompleted?: (data: IReadOneWHPMasterResponse) => void;
}) => {
  const { data: workingHourPlanMaster, loading: workingHourPlanMasterLoading } =
    useQuery<IReadOneWHPMasterResponse, IReadOneWHPMasterRequest>(
      READ_ONE_WHP_MASTER,
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
    workingHourPlanMaster: workingHourPlanMaster?.workingHourPlan,
    workingHourPlanMasterLoading,
  };
};
