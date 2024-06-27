import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ONE_STOCKPILE_MONITORING_RITAGE = gql`
  query ReadOneStockpileMonitoringRitage(
    $id: String!
    $page: Int
    $limit: Int
    $orderBy: String
    $orderDir: String
  ) {
    monitoringStockpileOreRitage(
      findAllMonitoringStockpileOreRitaseInput: {
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
      additional
      data {
        id
        date
        companyHeavyEquipment {
          id
          hullNumber
        }
        operators {
          id
          humanResource {
            id
            name
          }
        }
        shift {
          id
          name
        }
      }
    }
  }
`;

interface IReadOneStockpileMonitoringRitage {
  id: string;
  date: string | null;
  companyHeavyEquipment: {
    id: string;
    hullNumber: string;
  } | null;
  operators:
    | {
        id: string;
        humanResource: {
          id: string;
          name: string;
        };
      }[]
    | null;
  shift: {
    id: string;
    name: string;
  } | null;
}

interface IReadOneStockpileMonitoringRitageAdditional {
  tonByRitage: number | null;
  totalRitage: number | null;
}

interface IReadOneStockpileMonitoringRitageResponse {
  monitoringStockpileOreRitage: {
    additional: IReadOneStockpileMonitoringRitageAdditional | null;
  } & GResponse<IReadOneStockpileMonitoringRitage>;
}

interface IReadOneStockpileMonitoringRitageRequest
  extends Partial<IGlobalMetaRequest> {
  id: string;
}

export const useReadOneStockpileMonitoringRitage = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: IReadOneStockpileMonitoringRitageRequest;
  skip?: boolean;
  onCompleted?: (data: IReadOneStockpileMonitoringRitageResponse) => void;
}) => {
  const {
    data: monitoringStockpileOreRitage,
    loading: monitoringStockpileOreRitageLoading,
  } = useQuery<
    IReadOneStockpileMonitoringRitageResponse,
    IReadOneStockpileMonitoringRitageRequest
  >(READ_ONE_STOCKPILE_MONITORING_RITAGE, {
    variables,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted: onCompleted,
    skip,
    fetchPolicy: 'cache-first',
  });

  return {
    monitoringStockpileOreRitage:
      monitoringStockpileOreRitage?.monitoringStockpileOreRitage,
    monitoringStockpileOreRitageLoading,
  };
};
