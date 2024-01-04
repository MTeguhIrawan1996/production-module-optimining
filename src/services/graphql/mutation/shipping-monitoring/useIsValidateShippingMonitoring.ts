import { ApolloError, gql, useMutation } from '@apollo/client';

import { IUpdateStatusValues } from '@/types/global';

export const UPDATE_ISVALID_SHIPPING_MONITORING = gql`
  mutation UpdateIsValidateShippingMonitoring(
    $id: String!
    $status: Boolean
    $statusMessage: String
  ) {
    validateMonitoringBarging(
      validateMonitoringBargingInput: {
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

export interface IUpdateIsValidateShippingMonitoringRequest
  extends IUpdateStatusValues {
  id: string;
  status: boolean;
}

interface IUpdateIsValidateShippingMonitoringResponse {
  validateMonitoringBarging: {
    id: string;
    status: {
      id: string;
    };
  };
}

export const useUpdateIsValidateShippingMonitoring = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateIsValidateShippingMonitoringResponse) => void;
}) => {
  return useMutation<
    IUpdateIsValidateShippingMonitoringResponse,
    IUpdateIsValidateShippingMonitoringRequest
  >(UPDATE_ISVALID_SHIPPING_MONITORING, {
    onError,
    onCompleted,
  });
};
