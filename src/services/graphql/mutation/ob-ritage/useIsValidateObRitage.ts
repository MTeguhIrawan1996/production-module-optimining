import { ApolloError, gql, useMutation } from '@apollo/client';

import { IUpdateStatusValues } from '@/types/global';

export const UPDATE_ISVALID_OB_RITAGE = gql`
  mutation UpdateIsValidateObRitage(
    $id: String!
    $status: Boolean
    $statusMessage: String
  ) {
    validateOverburdenRitage(
      validateOverburdenRitageInput: {
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

export interface IUpdateIsValidateObRitageRequest extends IUpdateStatusValues {
  id: string;
  status: boolean;
}

interface IUpdateIsValidateObRitageResponse {
  validateOverburdenRitage: {
    id: string;
    status: {
      id: string;
    };
  };
}

export const useUpdateIsValidateObRitage = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateIsValidateObRitageResponse) => void;
}) => {
  return useMutation<
    IUpdateIsValidateObRitageResponse,
    IUpdateIsValidateObRitageRequest
  >(UPDATE_ISVALID_OB_RITAGE, {
    onError,
    onCompleted,
  });
};
