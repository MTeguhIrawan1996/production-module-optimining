import { ApolloError, gql, useMutation } from '@apollo/client';

import { IUpdateStatusValues } from '@/types/global';

export const UPDATE_ISVALID_TOPSOIL_RITAGE = gql`
  mutation UpdateIsValidateTopsoilRitage(
    $id: String!
    $status: Boolean
    $statusMessage: String
  ) {
    validateTopsoilRitage(
      validateTopsoilRitageInput: {
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

export interface IUpdateIsValidateTopsoilRitageRequest
  extends IUpdateStatusValues {
  id: string;
  status: boolean;
}

interface IUpdateIsValidateTopsoilRitageResponse {
  validateTopsoilRitage: {
    id: string;
    status: {
      id: string;
    };
  };
}

export const useUpdateIsValidateTopsoilRitage = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateIsValidateTopsoilRitageResponse) => void;
}) => {
  return useMutation<
    IUpdateIsValidateTopsoilRitageResponse,
    IUpdateIsValidateTopsoilRitageRequest
  >(UPDATE_ISVALID_TOPSOIL_RITAGE, {
    onError,
    onCompleted,
  });
};
