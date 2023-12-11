import { ApolloError, gql, useMutation } from '@apollo/client';

import { IUpdateStatusValues } from '@/types/global';

export const UPDATE_ISDETERMINED_OB_RITAGE = gql`
  mutation UpdateIsDeterminedObRitage(
    $id: String!
    $status: Boolean
    $statusMessage: String
  ) {
    determineOverburdenRitage(
      determineOverburdenRitageInput: {
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

export interface IUpdateIsDeterminedObRitageRequest
  extends IUpdateStatusValues {
  id: string;
  status: boolean;
}

interface IUpdateIsDeterminedObRitageResponse {
  determineOverburdenRitage: {
    id: string;
    status: {
      id: string;
    };
  };
}

export const useUpdateIsDeterminedObRitage = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateIsDeterminedObRitageResponse) => void;
}) => {
  return useMutation<
    IUpdateIsDeterminedObRitageResponse,
    IUpdateIsDeterminedObRitageRequest
  >(UPDATE_ISDETERMINED_OB_RITAGE, {
    onError,
    onCompleted,
  });
};
