import { ApolloError, gql, useMutation } from '@apollo/client';

export const UPDATE_WHP_MASTER = gql`
  mutation UpdateWHPMaster($id: String!, $activityName: String!) {
    updateWorkingHourPlan(
      updateWorkingHourPlanInput: { id: $id, activityName: $activityName }
    ) {
      id
    }
  }
`;

export interface IUpdateMutationWHPValues {
  activityName: string;
}

type IUpdateWHPMasterRequest = {
  id: string;
} & IUpdateMutationWHPValues;

interface IUpdateWHPMasterResponse {
  updateWorkingHourPlan: {
    id: string;
  };
}

export const useUpdateWHPMaster = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateWHPMasterResponse) => void;
}) => {
  return useMutation<IUpdateWHPMasterResponse, IUpdateWHPMasterRequest>(
    UPDATE_WHP_MASTER,
    {
      onError,
      onCompleted,
    }
  );
};
