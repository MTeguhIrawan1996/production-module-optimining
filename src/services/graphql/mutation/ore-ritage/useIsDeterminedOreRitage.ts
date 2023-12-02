import { ApolloError, gql, useMutation } from '@apollo/client';

import { IUpdateStatusValues } from '@/types/global';

export const UPDATE_ISDETERMINED_ORE_RITAGE = gql`
  mutation UpdateIsDeterminedOreRitage(
    $id: String!
    $status: Boolean
    $statusMessage: String
  ) {
    determineOreRitage(
      determineOreRitageInput: {
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

export interface IUpdateIsDeterminedOreRitageRequest
  extends IUpdateStatusValues {
  id: string;
  status: boolean;
}

interface IUpdateIsDeterminedOreRitageResponse {
  determineOreRitage: {
    id: string;
    status: {
      id: string;
    };
  };
}

export const useUpdateIsDeterminedOreRitage = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateIsDeterminedOreRitageResponse) => void;
}) => {
  return useMutation<
    IUpdateIsDeterminedOreRitageResponse,
    IUpdateIsDeterminedOreRitageRequest
  >(UPDATE_ISDETERMINED_ORE_RITAGE, {
    onError,
    onCompleted,
  });
};
