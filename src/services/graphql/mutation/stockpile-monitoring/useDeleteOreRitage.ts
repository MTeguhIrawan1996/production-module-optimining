import { ApolloError, gql, useMutation } from '@apollo/client';

export const DELETE_STOCKPILE_MONITORING = gql`
  mutation DeleteStockpileMonitoring($id: String!) {
    deleteMonitoringStockpile(id: $id)
  }
`;

export interface IDeleteStockpileMonitoringRequest {
  id: string;
}

interface IDeleteStockpileMonitoringResponse {
  deleteMonitoringStockpile: boolean;
}

export const useDeleteStockpileMonitoring = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IDeleteStockpileMonitoringResponse) => void;
}) => {
  return useMutation<
    IDeleteStockpileMonitoringResponse,
    IDeleteStockpileMonitoringRequest
  >(DELETE_STOCKPILE_MONITORING, {
    onError,
    onCompleted,
  });
};
