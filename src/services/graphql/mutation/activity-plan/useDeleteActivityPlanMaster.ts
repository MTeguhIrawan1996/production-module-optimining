import { ApolloError, gql, useMutation } from '@apollo/client';

export const DELETE_ACTIVITY_PLAN_MASTER = gql`
  mutation DeleteActivityPlanMaster($id: String!) {
    deleteActivityPlan(id: $id)
  }
`;

export interface IDeleteActivityPlanMasterRequest {
  id: string;
}

interface IDeleteActivityPlanMasterResponse {
  deleteActivityPlan: boolean;
}

export const useDeleteActivityPlanMaster = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IDeleteActivityPlanMasterResponse) => void;
}) => {
  return useMutation<
    IDeleteActivityPlanMasterResponse,
    IDeleteActivityPlanMasterRequest
  >(DELETE_ACTIVITY_PLAN_MASTER, {
    onError,
    onCompleted,
  });
};
