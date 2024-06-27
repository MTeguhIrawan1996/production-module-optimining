import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ONE_STOCKPILE_MONITORING_BARGING = gql`
  query ReadOneStockpileMonitoringBarging(
    $id: String!
    $page: Int
    $limit: Int
    $orderBy: String
    $orderDir: String
  ) {
    monitoringStockpileBargingRitage(
      findAllMonitoringStockpileBargingRitaseInput: {
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
        fromAt
        arriveAt
      }
    }
  }
`;

interface IReadOneStockpileMonitoringBarging {
  id: string;
  fromAt: string | null;
  arriveAt: string | null;
}

interface IReadOneStockpileMonitoringBargingResponse {
  monitoringStockpileBargingRitage: GResponse<IReadOneStockpileMonitoringBarging>;
}

interface IReadOneStockpileMonitoringBargingRequest
  extends Partial<IGlobalMetaRequest> {
  id: string;
}

export const useReadOneStockpileMonitoringBarging = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: IReadOneStockpileMonitoringBargingRequest;
  skip?: boolean;
  onCompleted?: (data: IReadOneStockpileMonitoringBargingResponse) => void;
}) => {
  const {
    data: monitoringStockpileBargingRitage,
    loading: monitoringStockpileBargingRitageLoading,
  } = useQuery<
    IReadOneStockpileMonitoringBargingResponse,
    IReadOneStockpileMonitoringBargingRequest
  >(READ_ONE_STOCKPILE_MONITORING_BARGING, {
    variables,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted: onCompleted,
    skip,
    fetchPolicy: 'cache-first',
  });

  return {
    monitoringStockpileBargingRitage:
      monitoringStockpileBargingRitage?.monitoringStockpileBargingRitage,
    monitoringStockpileBargingRitageLoading,
  };
};
