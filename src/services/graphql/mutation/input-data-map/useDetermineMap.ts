import { ApolloError, gql, useMutation } from '@apollo/client';

import { IUpdateStatusValues } from '@/types/global';

export const UPDATE_ISDETERMINED_MAP_DATA_PRODUCTION = gql`
  mutation determineMapDataStatus(
    $id: String!
    $status: Boolean
    $statusMessage: String
  ) {
    determineMapDataStatus(
      determineMapDataDataInput: {
        id: $id
        status: $status
        statusMessage: $statusMessage
      }
    ) {
      id
      mapDataStatus {
        id
        name
      }
    }
  }
`;

export interface IUpdateIsDeterminedMapDataProductionRequest
  extends IUpdateStatusValues {
  id: string;
  status: boolean;
}

interface IUpdateIsDeterminedMapDataProductionResponse {
  determineMapDataData: {
    id: string;
    mapDataStatus: {
      id: string;
    };
  };
}

export const useDeterminedMapDataProduction = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateIsDeterminedMapDataProductionResponse) => void;
}) => {
  return useMutation<
    IUpdateIsDeterminedMapDataProductionResponse,
    IUpdateIsDeterminedMapDataProductionRequest
  >(UPDATE_ISDETERMINED_MAP_DATA_PRODUCTION, {
    onError,
    onCompleted,
  });
};
