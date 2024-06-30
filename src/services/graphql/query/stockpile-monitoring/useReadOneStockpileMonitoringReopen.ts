import { ApolloError, gql, useQuery } from '@apollo/client';

export const READ_ONE_STOCKPILE_MONITORING_REOPEN = gql`
  query ReadOneStockpileMonitoringReopen($id: String!) {
    monitoringStockpileReopenRitage(monitoringStockpileId: $id) {
      openAt
      closeAt
    }
  }
`;

interface IReadOneStockpileMonitoringReopen {
  openAt: string | null;
  closeAt: string | null;
}

interface IReadOneStockpileMonitoringReopenResponse {
  monitoringStockpileReopenRitage: IReadOneStockpileMonitoringReopen[];
}

interface IReadOneStockpileMonitoringReopenRequest {
  id: string;
}

export const useReadOneStockpileMonitoringReopen = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: IReadOneStockpileMonitoringReopenRequest;
  skip?: boolean;
  onCompleted?: (data: IReadOneStockpileMonitoringReopenResponse) => void;
}) => {
  const {
    data: monitoringStockpileReopenRitage,
    loading: monitoringStockpileReopenRitageLoading,
  } = useQuery<
    IReadOneStockpileMonitoringReopenResponse,
    IReadOneStockpileMonitoringReopenRequest
  >(READ_ONE_STOCKPILE_MONITORING_REOPEN, {
    variables,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted: onCompleted,
    skip,
    fetchPolicy: 'cache-first',
  });

  return {
    monitoringStockpileReopenRitage:
      monitoringStockpileReopenRitage?.monitoringStockpileReopenRitage,
    monitoringStockpileReopenRitageLoading,
  };
};
