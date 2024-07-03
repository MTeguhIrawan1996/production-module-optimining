import { ApolloError, gql, useQuery } from '@apollo/client';

import { IReadOneStockpileDomeMaster } from '@/services/graphql/query/stockpile-master/useReadOneStockpileDomeMaster';

import { GResponse, IFile, IGlobalMetaRequest, IStatus } from '@/types/global';

export const READ_ONE_STOCKPILE_MONITORING = gql`
  query ReadOneStockpileMonitoring(
    $id: String!
    $page: Int
    $limit: Int
    $orderBy: String
    $orderDir: String
  ) {
    monitoringStockpile(id: $id) {
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
      domeStatus
      stockMaterial
      material {
        id
        name
      }
      openAt
      closeAt
      tonSurveys {
        id
        date
        ton
        volume
      }
      tonByRitage
      desc
      photo {
        id
        originalFileName
        url
        fileName
      }
      samples {
        id
        sample {
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
        sampleNumber
        isCreatedAfterDetermine
      }
      ritageSamples {
        additional
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
      }
      ritages(
        findAllOreRitageInput: {
          page: $page
          limit: $limit
          orderBy: $orderBy
          orderDir: $orderDir
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
      status {
        id
        name
      }
      statusMessage
      createdAt
    }
  }
`;

type IRitageSampleReadOneStockpileMonitoring = {
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

type ISampleReadOneStockpileMonitoring = {
  id: string;
  sampleNumber: string | null;
  sample: {
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
  } | null;
  isCreatedAfterDetermine: boolean;
};

interface IRitageData {
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

interface IReadOneStockpileMonitoring {
  id: string;
  dome: IReadOneStockpileDomeMaster | null;
  domeStatus: string | null;
  stockMaterial: number | null;
  material: {
    id: string;
    name: string;
  } | null;
  openAt: string | null;
  closeAt: string | null;
  tonSurveys:
    | {
        id: string;
        date: string | null;
        ton: number | null;
        volume: number | null;
      }[]
    | null;
  tonByRitage: number | null;
  desc: string | null;
  photo: Omit<IFile, 'mime' | 'path'> | null;
  samples: ISampleReadOneStockpileMonitoring[];
  ritageSamples:
    | ({
        additional: {
          averageSamples: {
            element: {
              id: string;
              name: string | null;
            };
            value: number | null;
          }[];
        };
      } & GResponse<IRitageSampleReadOneStockpileMonitoring>)
    | null;
  ritages: GResponse<IRitageData> | null;
  status: IStatus | null;
  statusMessage: string | null;
  createdAt: string | null;
}

interface IReadOneStockpileMonitoringResponse {
  monitoringStockpile: IReadOneStockpileMonitoring;
}

interface IReadOneStockpileMonitoringRequest
  extends Partial<IGlobalMetaRequest> {
  id: string;
}

/**
 * @deprecated Fungsi ini sudah tidak direkomendasikan untuk digunakan.
 * Akan dihapus pada versi berikutnya.
 */

export const useReadOneStockpileMonitoring = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: IReadOneStockpileMonitoringRequest;
  skip?: boolean;
  onCompleted?: (data: IReadOneStockpileMonitoringResponse) => void;
}) => {
  const { data: monitoringStockpile, loading: monitoringStockpileLoading } =
    useQuery<
      IReadOneStockpileMonitoringResponse,
      IReadOneStockpileMonitoringRequest
    >(READ_ONE_STOCKPILE_MONITORING, {
      variables,
      onError: (err: ApolloError) => {
        return err;
      },
      onCompleted: onCompleted,
      skip,
      fetchPolicy: 'cache-and-network',
    });

  return {
    monitoringStockpile: monitoringStockpile?.monitoringStockpile,
    monitoringStockpileLoading,
  };
};
