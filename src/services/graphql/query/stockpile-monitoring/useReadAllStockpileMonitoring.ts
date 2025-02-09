import {
  ApolloError,
  gql,
  useQuery,
  WatchQueryFetchPolicy,
} from '@apollo/client';

import { IReadOneStockpileDomeMaster } from '@/services/graphql/query/stockpile-master/useReadOneStockpileDomeMaster';

import { GResponse, IGlobalMetaRequest, IStatus } from '@/types/global';

export const READ_ALL_STOCKPILE_MONITORING_MASTER = gql`
  query ReadAllStockpileMonitoring(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
    $stockpileId: String
    $year: Float
    $month: Float
    $week: Float
    $domeStatus: String
  ) {
    monitoringStockpiles(
      findAllMonitoringStockpileInput: {
        page: $page
        limit: $limit
        search: $search
        orderBy: $orderBy
        orderDir: $orderDir
        stockpileId: $stockpileId
        year: $year
        month: $month
        week: $week
        domeStatus: $domeStatus
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
        dome {
          id
          name
          handBookId
          stockpile {
            id
            name
          }
        }
        material {
          id
          name
        }
        ritageSamples {
          additional
        }
        tonByRitage
        currentTonSurvey
        domeStatus
        status {
          id
          name
          color
        }
      }
    }
  }
`;

interface IMonitoringStockpilesData {
  id: string;
  dome: IReadOneStockpileDomeMaster | null;
  material: {
    id: string;
    name: string;
  } | null;
  ritageSamples: {
    additional: {
      averageSamples: {
        element: {
          id: string;
          name: string | null;
        };
        value: number | null;
      }[];
    };
  };
  tonByRitage: number | null;
  domeStatus: string | null;
  currentTonSurvey: number | null;
  status: IStatus | null;
}

interface IMonitoringStockpilesResponse {
  monitoringStockpiles: GResponse<IMonitoringStockpilesData>;
}

interface IMonitoringStockpilesRequest extends IGlobalMetaRequest {
  stockpileId: string | null;
  year: number | null;
  month: number | null;
  week: number | null;
}

/**
 * @deprecated Fungsi ini sudah tidak direkomendasikan untuk digunakan.
 * Akan dihapus pada versi berikutnya.
 */

export const useReadAllStockpileMonitoring = ({
  variables,
  onCompleted,
  skip,
  fetchPolicy = 'cache-first',
}: {
  variables?: Partial<IMonitoringStockpilesRequest>;
  onCompleted?: (data: IMonitoringStockpilesResponse) => void;
  skip?: boolean;
  fetchPolicy?: WatchQueryFetchPolicy;
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
    fetchPolicy,
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
