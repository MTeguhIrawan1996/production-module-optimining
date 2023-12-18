import { ApolloError, gql, useMutation } from '@apollo/client';

import { IUpdateStatusValues } from '@/types/global';

export const UPDATE_ISVALID_MOVING_RITAGE = gql`
  mutation UpdateIsValidateMovingRitage(
    $id: String!
    $status: Boolean
    $statusMessage: String
  ) {
    validateMovingRitage(
      validateMovingRitageInput: {
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

export interface IUpdateIsValidateMovingRitageRequest
  extends IUpdateStatusValues {
  id: string;
  status: boolean;
}

interface IUpdateIsValidateMovingRitageResponse {
  validateMovingRitage: {
    id: string;
    status: {
      id: string;
    };
  };
}

export const useUpdateIsValidateMovingRitage = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateIsValidateMovingRitageResponse) => void;
}) => {
  return useMutation<
    IUpdateIsValidateMovingRitageResponse,
    IUpdateIsValidateMovingRitageRequest
  >(UPDATE_ISVALID_MOVING_RITAGE, {
    onError,
    onCompleted,
  });
};
