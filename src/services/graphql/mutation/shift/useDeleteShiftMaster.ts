import { ApolloError, gql, useMutation } from '@apollo/client';

export const DELETE_SHIFT_MASTER = gql`
  mutation DeleteShiftMaster($id: String!) {
    deleteShift(id: $id)
  }
`;

export interface IDeleteShiftMasterRequest {
  id: string;
}

interface IDeleteShiftMasterResponse {
  deleteShift: boolean;
}

export const useDeleteShiftMaster = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IDeleteShiftMasterResponse) => void;
}) => {
  return useMutation<IDeleteShiftMasterResponse, IDeleteShiftMasterRequest>(
    DELETE_SHIFT_MASTER,
    {
      onError,
      onCompleted,
    }
  );
};
