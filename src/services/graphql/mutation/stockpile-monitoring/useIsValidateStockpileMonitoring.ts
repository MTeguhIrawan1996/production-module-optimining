import { ApolloError, gql, useMutation } from '@apollo/client';

import { IUpdateStatusValues } from '@/types/global';

export const UPDATE_ISVALID_STOCKPILE_MONITORING = gql`
  mutation UpdateIsValidateStockpileMonitoring(
    $id: String!
    $status: Boolean
    $statusMessage: String
  ) {
    validateMonitoringStockpile(
      validateMonitoringStockpileInput: {
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

export interface IUpdateIsValidateStockpileMonitoringRequest
  extends IUpdateStatusValues {
  id: string;
  status: boolean;
}

interface IUpdateIsValidateStockpileMonitoringResponse {
  validateMonitoringStockpile: {
    id: string;
    status: {
      id: string;
    };
  };
}

export const useUpdateIsValidateStockpileMonitoring = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateIsValidateStockpileMonitoringResponse) => void;
}) => {
  return useMutation<
    IUpdateIsValidateStockpileMonitoringResponse,
    IUpdateIsValidateStockpileMonitoringRequest
  >(UPDATE_ISVALID_STOCKPILE_MONITORING, {
    onError,
    onCompleted,
  });
};
