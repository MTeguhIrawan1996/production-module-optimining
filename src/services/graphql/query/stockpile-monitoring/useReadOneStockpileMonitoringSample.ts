import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ONE_STOCKPILE_MONITORING_SAMPLE = gql`
  query ReadOneStockpileMonitoringSample(
    $id: String!
    $page: Int
    $limit: Int
    $orderBy: String
    $orderDir: String
  ) {
    monitoringStockpileSamples(
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
        monitoringStockpileSample {
          id
          isCreatedAfterDetermine
        }
      }
      meta {
        currentPage
        totalPage
        totalData
        totalAllData
      }
    }
  }
`;

export type ISampleDataStockpileMonitoring = {
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
  monitoringStockpileSample: {
    id: string;
    isCreatedAfterDetermine: boolean;
  };
};

interface IReadOneStockpileMonitoringSampleResponse {
  monitoringStockpileSamples: GResponse<ISampleDataStockpileMonitoring>;
}

interface IReadOneStockpileMonitoringSampleRequest
  extends Partial<IGlobalMetaRequest> {
  id: string;
}

export const useReadOneStockpileMonitoringSample = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: IReadOneStockpileMonitoringSampleRequest;
  skip?: boolean;
  onCompleted?: (data: IReadOneStockpileMonitoringSampleResponse) => void;
}) => {
  const {
    data: monitoringStockpileSamples,
    loading: monitoringStockpileSamplesLoading,
  } = useQuery<
    IReadOneStockpileMonitoringSampleResponse,
    IReadOneStockpileMonitoringSampleRequest
  >(READ_ONE_STOCKPILE_MONITORING_SAMPLE, {
    variables,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted: onCompleted,
    skip,
    fetchPolicy: 'cache-and-network',
  });

  return {
    monitoringStockpileSamples:
      monitoringStockpileSamples?.monitoringStockpileSamples,
    monitoringStockpileSamplesLoading,
  };
};
