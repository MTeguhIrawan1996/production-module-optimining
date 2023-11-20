import { ApolloError, gql, useMutation } from '@apollo/client';

import { IMutationShiftValues } from '@/services/graphql/mutation/shift/useCreateShiftMaster';

export const UPDATE_SHIFT_MASTER = gql`
  mutation UpdateShiftMaster(
    $id: String!
    $name: String!
    $startHour: String!
    $endHour: String!
  ) {
    updateShift(
      updateShiftInput: {
        id: $id
        name: $name
        startHour: $startHour
        endHour: $endHour
      }
    ) {
      id
    }
  }
`;

type IUpdateShiftMasterRequest = {
  id: string;
} & IMutationShiftValues;

interface IUpdateShiftMasterResponse {
  updateShift: {
    id: string;
  };
}

export const useUpdateShiftMaster = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateShiftMasterResponse) => void;
}) => {
  return useMutation<IUpdateShiftMasterResponse, IUpdateShiftMasterRequest>(
    UPDATE_SHIFT_MASTER,
    {
      onError,
      onCompleted,
    }
  );
};
