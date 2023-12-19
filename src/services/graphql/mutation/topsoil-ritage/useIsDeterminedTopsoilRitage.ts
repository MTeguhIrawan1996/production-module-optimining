import { ApolloError, gql, useMutation } from '@apollo/client';

import { IUpdateStatusValues } from '@/types/global';

export const UPDATE_ISDETERMINED_TOPSOIL_RITAGE = gql`
  mutation UpdateIsDeterminedTopsoilRitage(
    $id: String!
    $status: Boolean
    $statusMessage: String
  ) {
    determineTopsoilRitage(
      determineTopsoilRitageInput: {
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

export interface IUpdateIsDeterminedTopsoilRitageRequest
  extends IUpdateStatusValues {
  id: string;
  status: boolean;
}

interface IUpdateIsDeterminedTopsoilRitageResponse {
  determineTopsoilRitage: {
    id: string;
    status: {
      id: string;
    };
  };
}

export const useUpdateIsDeterminedTopsoilRitage = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateIsDeterminedTopsoilRitageResponse) => void;
}) => {
  return useMutation<
    IUpdateIsDeterminedTopsoilRitageResponse,
    IUpdateIsDeterminedTopsoilRitageRequest
  >(UPDATE_ISDETERMINED_TOPSOIL_RITAGE, {
    onError,
    onCompleted,
  });
};
