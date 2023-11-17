import { ApolloError, gql, useMutation } from '@apollo/client';

export const CREATE_WHP_MASTER = gql`
  mutation CreateWHPMaster(
    $createWorkingHourPlans: [CreateWorkingHourPlanDto!]
  ) {
    createWorkingHourPlanBulk(
      createWorkingHourPlanBulkInput: {
        createWorkingHourPlans: $createWorkingHourPlans
      }
    ) {
      id
    }
  }
`;

export interface IMutationWHPValues {
  createWorkingHourPlans: {
    activityName: string;
  }[];
}

type ICreateWHPMasterRequest = IMutationWHPValues;

interface ICreateWHPMasterResponse {
  createWorkingHourPlanBulk: {
    id: string;
  };
}

export const useCreateWHPMaster = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: ICreateWHPMasterResponse) => void;
}) => {
  return useMutation<ICreateWHPMasterResponse, ICreateWHPMasterRequest>(
    CREATE_WHP_MASTER,
    {
      onError,
      onCompleted,
    }
  );
};
