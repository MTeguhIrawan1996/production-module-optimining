import { ApolloError, gql, useMutation } from '@apollo/client';

export const DELETE_WHP_MASTER = gql`
  mutation DeleteWHPMaster($id: String!) {
    deleteWorkingHourPlan(id: $id)
  }
`;

export interface IDeleteWHPMasterRequest {
  id: string;
}

interface IDeleteWHPMasterResponse {
  deleteWorkingHourPlan: boolean;
}

export const useDeleteWHPMaster = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IDeleteWHPMasterResponse) => void;
}) => {
  return useMutation<IDeleteWHPMasterResponse, IDeleteWHPMasterRequest>(
    DELETE_WHP_MASTER,
    {
      onError,
      onCompleted,
    }
  );
};
