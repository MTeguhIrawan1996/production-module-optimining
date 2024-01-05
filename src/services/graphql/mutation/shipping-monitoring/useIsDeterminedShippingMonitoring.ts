import { ApolloError, gql, useMutation } from '@apollo/client';

import { IUpdateStatusValues } from '@/types/global';

export const UPDATE_ISDETERMINED_SHIPPING_MONITORING = gql`
  mutation UpdateIsDeterminedShippingMonitoring(
    $id: String!
    $status: Boolean
    $statusMessage: String
  ) {
    determineMonitoringBarging(
      determineMonitoringBargingInput: {
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

export interface IUpdateIsDeterminedShippingMonitoringRequest
  extends IUpdateStatusValues {
  id: string;
  status: boolean;
}

interface IUpdateIsDeterminedShippingMonitoringResponse {
  determineMonitoringBarging: {
    id: string;
    status: {
      id: string;
    };
  };
}

export const useUpdateIsDeterminedShippingMonitoring = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateIsDeterminedShippingMonitoringResponse) => void;
}) => {
  return useMutation<
    IUpdateIsDeterminedShippingMonitoringResponse,
    IUpdateIsDeterminedShippingMonitoringRequest
  >(UPDATE_ISDETERMINED_SHIPPING_MONITORING, {
    onError,
    onCompleted,
  });
};
