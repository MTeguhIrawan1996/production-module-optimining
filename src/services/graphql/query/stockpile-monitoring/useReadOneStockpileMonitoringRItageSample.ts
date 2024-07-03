import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ONE_STOCKPILE_MONITORING_RITAGE_SAMPLE = gql`
  query ReadOneStockpileMonitoringRitageSample(
    $id: String!
    $page: Int
    $limit: Int
    $orderBy: String
    $orderDir: String
  ) {
    monitoringStockpileSampleRitage(
      findAllMonitoringStockpileSampleRitageInput: {
        monitoringStockpileId: $id
        page: $page
        limit: $limit
        orderBy: $orderBy
        orderDir: $orderDir
      }
    ) {
      data {
        id
        sampleNumber
        sampleDate
        sampleType {
          id
          name
        }
        elements {
          element {
            id
            name
          }
          value
        }
      }
      additional
      meta {
        currentPage
        totalPage
        totalData
        totalAllData
      }
    }
  }
`;

export type IRitageSampleDataStockpileMonitoring = {
  id: string;
  sampleNumber: string | null;
  sampleDate: string | null;
  sampleType: {
    id: string;
    name: string;
  };
  elements: {
    element: {
      id: string;
      name: string | null;
    };
    value: number | null;
  }[];
};

interface IReadOneStockpileMonitoringRitageSampleResponse {
  monitoringStockpileSampleRitage: {
    additional: {
      averageSamples: {
        element: {
          id: string;
          name: string | null;
        };
        value: number | null;
      }[];
    };
  } & GResponse<IRitageSampleDataStockpileMonitoring>;
}

interface IReadOneStockpileMonitoringRitageSampleRequest
  extends Partial<IGlobalMetaRequest> {
  id: string;
}

export const useReadOneStockpileMonitoringRitageSample = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: IReadOneStockpileMonitoringRitageSampleRequest;
  skip?: boolean;
  onCompleted?: (data: IReadOneStockpileMonitoringRitageSampleResponse) => void;
}) => {
  const {
    data: monitoringStockpileSampleRitage,
    loading: monitoringStockpileSampleRitageLoading,
  } = useQuery<
    IReadOneStockpileMonitoringRitageSampleResponse,
    IReadOneStockpileMonitoringRitageSampleRequest
  >(READ_ONE_STOCKPILE_MONITORING_RITAGE_SAMPLE, {
    variables,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted: onCompleted,
    skip,
    fetchPolicy: 'cache-first',
  });

  return {
    monitoringStockpileSampleRitage:
      monitoringStockpileSampleRitage?.monitoringStockpileSampleRitage,
    monitoringStockpileSampleRitageLoading,
  };
};
