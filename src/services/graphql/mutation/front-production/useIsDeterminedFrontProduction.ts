import { ApolloError, gql, useMutation } from '@apollo/client';

import { IUpdateStatusValues } from '@/types/global';

export const UPDATE_ISDETERMINED_FRONT_PRODUCTION = gql`
  mutation UpdateIsDeterminedFrontProduction(
    $id: String!
    $status: Boolean
    $statusMessage: String
  ) {
    determineFrontData(
      determineFrontDataInput: {
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

export interface IUpdateIsDeterminedFrontProductionRequest
  extends IUpdateStatusValues {
  id: string;
  status: boolean;
}

interface IUpdateIsDeterminedFrontProductionResponse {
  determineFrontData: {
    id: string;
    status: {
      id: string;
    };
  };
}

export const useUpdateIsDeterminedFrontProduction = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateIsDeterminedFrontProductionResponse) => void;
}) => {
  return useMutation<
    IUpdateIsDeterminedFrontProductionResponse,
    IUpdateIsDeterminedFrontProductionRequest
  >(UPDATE_ISDETERMINED_FRONT_PRODUCTION, {
    onError,
    onCompleted,
  });
};
