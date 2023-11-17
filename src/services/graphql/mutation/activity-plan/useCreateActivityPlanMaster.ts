import { ApolloError, gql, useMutation } from '@apollo/client';

import { IMutationActivityPlanValues } from '@/services/graphql/mutation/activity-plan/useUpdateActivityPlanMaster';

export const CREATE_ACTIVITY_PLAN_MASTER = gql`
  mutation CreateActivityPlanMaster($name: String!) {
    createActivityPlan(createActivityPlanInput: { name: $name }) {
      id
    }
  }
`;

type ICreateActivityPlanMasterRequest = IMutationActivityPlanValues;

interface ICreateActivityPlanMasterResponse {
  createActivityPlan: {
    id: string;
  };
}

export const useCreateActivityPlanMaster = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: ICreateActivityPlanMasterResponse) => void;
}) => {
  return useMutation<
    ICreateActivityPlanMasterResponse,
    ICreateActivityPlanMasterRequest
  >(CREATE_ACTIVITY_PLAN_MASTER, {
    onError,
    onCompleted,
  });
};
