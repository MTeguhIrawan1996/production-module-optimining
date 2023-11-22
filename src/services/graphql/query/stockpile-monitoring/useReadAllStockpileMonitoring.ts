import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_STOCKPILE_MONITORING_MASTER = gql`
  query ReadAllStockpileMonitoring(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
    $stockpileId: String
  ) {
    monitoringStockpiles(
      findAllMonitoringStockpileInput: {
        page: $page
        limit: $limit
        search: $search
        orderBy: $orderBy
        orderDir: $orderDir
        stockpileId: $stockpileId
      }
    ) {
      meta {
        currentPage
        totalPage
        totalData
        totalAllData
      }
      data {
        id
        stockpile {
          id
          name
        }
        dome {
          id
          name
          handBookId
        }
        material {
          id
          name
        }
        currentSample {
          id
          elements {
            elementName
            value
          }
        }
      }
    }
  }
`;

export interface IMonitoringStockpilesData {
  id: string;
  stockpile: {
    id: string;
    name: string;
  } | null;
  dome: {
    id: string;
    name: string;
    handBookId: string;
  } | null;
  material: {
    id: string;
    name: string;
  } | null;
  currentSample: {
    id: string;
    elements:
      | {
          elementName: string;
          value: string;
        }[]
      | null;
  };
}

interface IMonitoringStockpilesResponse {
  monitoringStockpiles: GResponse<IMonitoringStockpilesData>;
}

interface IMonitoringStockpilesRequest extends IGlobalMetaRequest {
  stockpileId: string | null;
  year: string | null;
  month: string | null;
}

export const useReadAllStockpileMonitoring = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: Partial<IMonitoringStockpilesRequest>;
  onCompleted?: (data: IMonitoringStockpilesResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: monitoringStockpilesData,
    loading: monitoringStockpilesDataLoading,
    refetch,
  } = useQuery<
    IMonitoringStockpilesResponse,
    Partial<IMonitoringStockpilesRequest>
  >(READ_ALL_STOCKPILE_MONITORING_MASTER, {
    variables: variables,
    skip: skip,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted,
    fetchPolicy: 'cache-and-network',
  });

  return {
    monitoringStockpilesData:
      monitoringStockpilesData?.monitoringStockpiles.data,
    monitoringStockpilesDataMeta:
      monitoringStockpilesData?.monitoringStockpiles.meta,
    monitoringStockpilesDataLoading,
    refetchMonitoringStockpiles: refetch,
  };
};
