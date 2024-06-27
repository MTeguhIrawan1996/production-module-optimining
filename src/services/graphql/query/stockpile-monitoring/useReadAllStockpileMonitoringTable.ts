import {
  ApolloError,
  gql,
  useQuery,
  WatchQueryFetchPolicy,
} from '@apollo/client';

import { IReadOneStockpileDomeMaster } from '@/services/graphql/query/stockpile-master/useReadOneStockpileDomeMaster';

import { GResponse, IGlobalMetaRequest, IStatus } from '@/types/global';

export const READ_ALL_STOCKPILE_MONITORING_TABLE = gql`
  query ReadAllStockpileMonitoringTable(
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
    monitoringStockpilesTable(
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

export interface IMonitoringStockpilesTableData {
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

interface IMonitoringStockpilesTableResponse {
  monitoringStockpilesTable: GResponse<IMonitoringStockpilesTableData>;
}

interface IMonitoringStockpilesTableRequest extends IGlobalMetaRequest {
  stockpileId: string | null;
  year: number | null;
  month: number | null;
  week: number | null;
}

export const useReadAllStockpileMonitoringTable = ({
  variables,
  onCompleted,
  skip,
  fetchPolicy = 'cache-first',
}: {
  variables?: Partial<IMonitoringStockpilesTableRequest>;
  onCompleted?: (data: IMonitoringStockpilesTableResponse) => void;
  skip?: boolean;
  fetchPolicy?: WatchQueryFetchPolicy;
}) => {
  const {
    data: monitoringStockpilesTableData,
    loading: monitoringStockpilesTableDataLoading,
    refetch,
  } = useQuery<
    IMonitoringStockpilesTableResponse,
    Partial<IMonitoringStockpilesTableRequest>
  >(READ_ALL_STOCKPILE_MONITORING_TABLE, {
    variables: variables,
    skip: skip,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted,
    fetchPolicy,
  });

  return {
    monitoringStockpilesTableData:
      monitoringStockpilesTableData?.monitoringStockpilesTable.data,
    monitoringStockpilesTableDataMeta:
      monitoringStockpilesTableData?.monitoringStockpilesTable.meta,
    monitoringStockpilesTableDataLoading,
    refetchMonitoringStockpilesTable: refetch,
  };
};
