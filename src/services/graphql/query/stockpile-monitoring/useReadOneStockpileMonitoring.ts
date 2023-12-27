import { ApolloError, gql, useQuery } from '@apollo/client';

import { IReadOneStockpileDomeMaster } from '@/services/graphql/query/stockpile-master/useReadOneStockpileDomeMaster';

import { IFile, IReadOneRitage } from '@/types/global';

export const READ_ONE_STOCKPILE_MONITORING = gql`
  query ReadOneStockpileMonitoring($id: String!) {
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
      material {
        id
        name
      }
      openAt
      closeAt
      tonSurveys {
        date
        ton
      }
      tonByRitage
      bargingStartAt
      bargingFinishAt
      movings {
        startAt
        finishAt
      }
      reopens {
        openAt
        closeAt
      }
      desc
      photo {
        id
        originalFileName
        url
        fileName
      }
      currentSample {
        id
        date
        sampleNumber
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
  }
`;

interface IReadOneStockpileMonitoring {
  id: string;
  dome: IReadOneStockpileDomeMaster | null;
  material: {
    id: string;
    name: string;
  } | null;
  openAt: string | null;
  closeAt: string | null;
  tonSurveys:
    | {
        date: string | null;
        ton: number | null;
      }[]
    | null;
  tonByRitage: number | null;
  bargingStartAt: string | null;
  bargingFinishAt: string | null;
  movings:
    | {
        startAt: string | null;
        finishAt: string | null;
      }[]
    | null;
  reopens:
    | {
        openAt: string | null;
        closeAt: string | null;
      }[]
    | null;
  desc: string | null;
  photos: Omit<IFile, 'mime' | 'path'>[] | null;
  currentSample: {
    id: string;
    date: string | null;
    sampleNumber: string | null;
    sampleType: {
      id: string;
      name: string | null;
    };
    elements: {
      element: {
        id: string;
        name: string | null;
      };
      value: number | null;
    }[];
  };
}

interface IReadOneStockpileMonitoringResponse {
  monitoringStockpile: IReadOneRitage<IReadOneStockpileMonitoring>;
}

interface IReadOneStockpileMonitoringRequest {
  id: string;
}

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
