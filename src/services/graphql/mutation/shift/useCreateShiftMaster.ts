import { ApolloError, gql, useMutation } from '@apollo/client';

export const CREATE_SHIFT_MASTER = gql`
  mutation CreateShiftMaster(
    $name: String!
    $startHour: String!
    $endHour: String!
  ) {
    createShift(
      createShiftInput: {
        name: $name
        startHour: $startHour
        endHour: $endHour
      }
    ) {
      id
    }
  }
`;

export interface IMutationShiftValues {
  name: string;
  startHour: string;
  endHour: string;
}

type ICreateShiftMasterRequest = IMutationShiftValues;

interface ICreateShiftMasterResponse {
  createShift: {
    id: string;
  };
}

export const useCreateShiftMaster = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: ICreateShiftMasterResponse) => void;
}) => {
  return useMutation<ICreateShiftMasterResponse, ICreateShiftMasterRequest>(
    CREATE_SHIFT_MASTER,
    {
      onError,
      onCompleted,
    }
  );
};
