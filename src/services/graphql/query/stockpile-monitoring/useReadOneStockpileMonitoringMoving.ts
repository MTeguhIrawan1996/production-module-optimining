import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ONE_STOCKPILE_MONITORING_MOVING = gql`
  query ReadOneStockpileMonitoringMoving(
    $id: String!
    $page: Int
    $limit: Int
    $orderBy: String
    $orderDir: String
  ) {
    monitoringStockpileMovingRitage(
      findAllMonitoringStockpileMovingRitaseInput: {
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

interface IReadOneStockpileMonitoringMoving {
  id: string;
  fromAt: string | null;
  arriveAt: string | null;
}

interface IReadOneStockpileMonitoringMovingResponse {
  monitoringStockpileMovingRitage: GResponse<IReadOneStockpileMonitoringMoving>;
}

interface IReadOneStockpileMonitoringMovingRequest
  extends Partial<IGlobalMetaRequest> {
  id: string;
}

export const useReadOneStockpileMonitoringMoving = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: IReadOneStockpileMonitoringMovingRequest;
  skip?: boolean;
  onCompleted?: (data: IReadOneStockpileMonitoringMovingResponse) => void;
}) => {
  const {
    data: monitoringStockpileMovingRitage,
    loading: monitoringStockpileMovingRitageLoading,
  } = useQuery<
    IReadOneStockpileMonitoringMovingResponse,
    IReadOneStockpileMonitoringMovingRequest
  >(READ_ONE_STOCKPILE_MONITORING_MOVING, {
    variables,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted: onCompleted,
    skip,
    fetchPolicy: 'cache-first',
  });

  return {
    monitoringStockpileMovingRitage:
      monitoringStockpileMovingRitage?.monitoringStockpileMovingRitage,
    monitoringStockpileMovingRitageLoading,
  };
};
