import { ApolloError, gql, useMutation } from '@apollo/client';

import { IUpdateStatusValues } from '@/types/global';

export const UPDATE_ISDETERMINED_STOCKPILE_MONITORING = gql`
  mutation UpdateIsDeterminedStockpileMonitoring(
    $id: String!
    $status: Boolean
    $statusMessage: String
  ) {
    determineMonitoringStockpile(
      determineMonitoringStockpileInput: {
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

export interface IUpdateIsDeterminedStockpileMonitoringRequest
  extends IUpdateStatusValues {
  id: string;
  status: boolean;
}

interface IUpdateIsDeterminedStockpileMonitoringResponse {
  determineMonitoringStockpile: {
    id: string;
    status: {
      id: string;
    };
  };
}

export const useUpdateIsDeterminedStockpileMonitoring = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateIsDeterminedStockpileMonitoringResponse) => void;
}) => {
  return useMutation<
    IUpdateIsDeterminedStockpileMonitoringResponse,
    IUpdateIsDeterminedStockpileMonitoringRequest
  >(UPDATE_ISDETERMINED_STOCKPILE_MONITORING, {
    onError,
    onCompleted,
  });
};
