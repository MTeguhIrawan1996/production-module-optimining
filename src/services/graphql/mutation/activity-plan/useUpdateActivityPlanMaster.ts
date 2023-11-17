import { ApolloError, gql, useMutation } from '@apollo/client';

export const UPDATE_ACTIVITY_PLAN_MASTER = gql`
  mutation UpdateActivityPlanMaster($id: String!, $name: String!) {
    updateActivityPlan(updateActivityPlanInput: { id: $id, name: $name }) {
      id
    }
  }
`;

export interface IMutationActivityPlanValues {
  name: string;
}

type IUpdateActivityPlanMasterRequest = {
  id: string;
} & IMutationActivityPlanValues;

interface IUpdateActivityPlanMasterResponse {
  updateActivityPlan: {
    id: string;
  };
}

export const useUpdateActivityPlanMaster = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateActivityPlanMasterResponse) => void;
}) => {
  return useMutation<
    IUpdateActivityPlanMasterResponse,
    IUpdateActivityPlanMasterRequest
  >(UPDATE_ACTIVITY_PLAN_MASTER, {
    onError,
    onCompleted,
  });
};
