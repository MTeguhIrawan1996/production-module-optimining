import { ApolloError, gql, useMutation } from '@apollo/client';

import { IUpdateStatusValues } from '@/types/global';

export const UPDATE_ISVALID_ORE_RITAGE = gql`
  mutation UpdateIsValidateOreRitage(
    $id: String!
    $status: Boolean
    $statusMessage: String
  ) {
    validateOreRitage(
      validateOreRitageInput: {
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

export interface IUpdateIsValidateOreRitageRequest extends IUpdateStatusValues {
  id: string;
  status: boolean;
}

interface IUpdateIsValidateOreRitageResponse {
  validateOreRitage: {
    id: string;
    status: {
      id: string;
    };
  };
}

export const useUpdateIsValidateOreRitage = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateIsValidateOreRitageResponse) => void;
}) => {
  return useMutation<
    IUpdateIsValidateOreRitageResponse,
    IUpdateIsValidateOreRitageRequest
  >(UPDATE_ISVALID_ORE_RITAGE, {
    onError,
    onCompleted,
  });
};
