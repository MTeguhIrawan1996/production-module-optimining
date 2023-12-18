import { ApolloError, gql, useMutation } from '@apollo/client';

import { IUpdateStatusValues } from '@/types/global';

export const UPDATE_ISDETERMINED_MOVING_RITAGE = gql`
  mutation UpdateIsDeterminedMovingRitage(
    $id: String!
    $status: Boolean
    $statusMessage: String
  ) {
    determineMovingRitage(
      determineMovingRitageInput: {
        id: $id
        status: $status
        statusMessage: $statusMessage
      }
    ) {
      id
      status {
        id
        name
      }
    }
  }
`;

export interface IUpdateIsDeterminedMovingRitageRequest
  extends IUpdateStatusValues {
  id: string;
  status: boolean;
}

interface IUpdateIsDeterminedMovingRitageResponse {
  determineMovingRitage: {
    id: string;
    status: {
      id: string;
    };
  };
}

export const useUpdateIsDeterminedMovingRitage = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateIsDeterminedMovingRitageResponse) => void;
}) => {
  return useMutation<
    IUpdateIsDeterminedMovingRitageResponse,
    IUpdateIsDeterminedMovingRitageRequest
  >(UPDATE_ISDETERMINED_MOVING_RITAGE, {
    onError,
    onCompleted,
  });
};
