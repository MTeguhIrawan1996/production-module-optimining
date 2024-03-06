import { ApolloError, gql, useMutation } from '@apollo/client';

export const DELETE_SHIPPING_MONITORING = gql`
  mutation DeleteShippingMonitoring($id: String!) {
    deleteMonitoringBarging(id: $id)
  }
`;

export interface IDeleteShippingMonitoringRequest {
  id: string;
}

interface IDeleteShippingMonitoringResponse {
  deleteMonitoringBarging: boolean;
}

export const useDeleteShippingMonitoring = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IDeleteShippingMonitoringResponse) => void;
}) => {
  return useMutation<
    IDeleteShippingMonitoringResponse,
    IDeleteShippingMonitoringRequest
  >(DELETE_SHIPPING_MONITORING, {
    onError,
    onCompleted,
  });
};
