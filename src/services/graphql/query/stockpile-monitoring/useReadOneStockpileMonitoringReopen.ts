import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ONE_STOCKPILE_MONITORING_REOPEN = gql`
  query ReadOneStockpileMonitoringReopen(
    $id: String!
    $page: Int
    $limit: Int
    $orderBy: String
    $orderDir: String
  ) {
    monitoringStockpileReopenRitage(
      findAllMonitoringStockpileReopenRitaseInput: {
        page: $page
        limit: $limit
        orderBy: $orderBy
        orderDir: $orderDir
        monitoringStockpileId: $id
      }
    ) {
      meta {
        currentPage
        totalAllData
        totalData
        totalPage
      }
      data {
        id
        openAt
        closeAt
      }
    }
  }
`;

interface IReadOneStockpileMonitoringReopen {
  id: string;
  openAt: string | null;
  closeAt: string | null;
}

interface IReadOneStockpileMonitoringReopenResponse {
  monitoringStockpileReopenRitage: GResponse<IReadOneStockpileMonitoringReopen>;
}

interface IReadOneStockpileMonitoringReopenRequest
  extends Partial<IGlobalMetaRequest> {
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
