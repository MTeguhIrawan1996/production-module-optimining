import { ApolloError, gql, useMutation } from '@apollo/client';

import { IUpdateStatusValues } from '@/types/global';

export const UPDATE_ISDETERMINED_BARGING_RITAGE = gql`
  mutation UpdateIsDeterminedBargingRitage(
    $id: String!
    $status: Boolean
    $statusMessage: String
  ) {
    determineBargingRitage(
      determineBargingRitageInput: {
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

export interface IUpdateIsDeterminedBargingRitageRequest
  extends IUpdateStatusValues {
  id: string;
  status: boolean;
}

interface IUpdateIsDeterminedBargingRitageResponse {
  determineBargingRitage: {
    id: string;
    status: {
      id: string;
    };
  };
}

export const useUpdateIsDeterminedBargingRitage = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateIsDeterminedBargingRitageResponse) => void;
}) => {
  return useMutation<
    IUpdateIsDeterminedBargingRitageResponse,
    IUpdateIsDeterminedBargingRitageRequest
  >(UPDATE_ISDETERMINED_BARGING_RITAGE, {
    onError,
    onCompleted,
  });
};
