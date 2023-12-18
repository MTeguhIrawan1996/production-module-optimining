import { ApolloError, gql, useMutation } from '@apollo/client';

import { IUpdateStatusValues } from '@/types/global';

export const UPDATE_ISVALID_QUARRY_RITAGE = gql`
  mutation UpdateIsValidateQuarryRitage(
    $id: String!
    $status: Boolean
    $statusMessage: String
  ) {
    validateQuarryRitage(
      validateQuarryRitageInput: {
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

export interface IUpdateIsValidateQuarryRitageRequest
  extends IUpdateStatusValues {
  id: string;
  status: boolean;
}

interface IUpdateIsValidateQuarryRitageResponse {
  validateQuarryRitage: {
    id: string;
    status: {
      id: string;
    };
  };
}

export const useUpdateIsValidateQuarryRitage = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateIsValidateQuarryRitageResponse) => void;
}) => {
  return useMutation<
    IUpdateIsValidateQuarryRitageResponse,
    IUpdateIsValidateQuarryRitageRequest
  >(UPDATE_ISVALID_QUARRY_RITAGE, {
    onError,
    onCompleted,
  });
};
