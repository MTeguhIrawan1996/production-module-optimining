import { ApolloError, gql, useMutation } from '@apollo/client';

import { IUpdateStatusValues } from '@/types/global';

export const UPDATE_ISDETERMINED_QUARRY_RITAGE = gql`
  mutation UpdateIsDeterminedQuarryRitage(
    $id: String!
    $status: Boolean
    $statusMessage: String
  ) {
    determineQuarryRitage(
      determineQuarryRitageInput: {
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

export interface IUpdateIsDeterminedQuarryRitageRequest
  extends IUpdateStatusValues {
  id: string;
  status: boolean;
}

interface IUpdateIsDeterminedQuarryRitageResponse {
  determineQuarryRitage: {
    id: string;
    status: {
      id: string;
    };
  };
}

export const useUpdateIsDeterminedQuarryRitage = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateIsDeterminedQuarryRitageResponse) => void;
}) => {
  return useMutation<
    IUpdateIsDeterminedQuarryRitageResponse,
    IUpdateIsDeterminedQuarryRitageRequest
  >(UPDATE_ISDETERMINED_QUARRY_RITAGE, {
    onError,
    onCompleted,
  });
};
