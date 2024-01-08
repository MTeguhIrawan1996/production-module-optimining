import { ApolloError, gql, useMutation } from '@apollo/client';

import { IUpdateStatusValues } from '@/types/global';

export const UPDATE_ISVALID_FRONT_PRODUCTION = gql`
  mutation UpdateIsValidateFrontProduction(
    $id: String!
    $status: Boolean
    $statusMessage: String
  ) {
    validateFrontData(
      validateFrontDataInput: {
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

export interface IUpdateIsValidateFrontProductionRequest
  extends IUpdateStatusValues {
  id: string;
  status: boolean;
}

interface IUpdateIsValidateFrontProductionResponse {
  validateFrontData: {
    id: string;
    status: {
      id: string;
    };
  };
}

export const useUpdateIsValidateFrontProduction = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateIsValidateFrontProductionResponse) => void;
}) => {
  return useMutation<
    IUpdateIsValidateFrontProductionResponse,
    IUpdateIsValidateFrontProductionRequest
  >(UPDATE_ISVALID_FRONT_PRODUCTION, {
    onError,
    onCompleted,
  });
};
