import { ApolloError, gql, useMutation } from '@apollo/client';

import { IUpdateStatusValues } from '@/types/global';

export const UPDATE_ISVALID_BARGING_RITAGE = gql`
  mutation UpdateIsValidateBargingRitage(
    $id: String!
    $status: Boolean
    $statusMessage: String
  ) {
    validateBargingRitage(
      validateBargingRitageInput: {
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

export interface IUpdateIsValidateBargingRitageRequest
  extends IUpdateStatusValues {
  id: string;
  status: boolean;
}

interface IUpdateIsValidateBargingRitageResponse {
  validateBargingRitage: {
    id: string;
    status: {
      id: string;
    };
  };
}

export const useUpdateIsValidateBargingRitage = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateIsValidateBargingRitageResponse) => void;
}) => {
  return useMutation<
    IUpdateIsValidateBargingRitageResponse,
    IUpdateIsValidateBargingRitageRequest
  >(UPDATE_ISVALID_BARGING_RITAGE, {
    onError,
    onCompleted,
  });
};
