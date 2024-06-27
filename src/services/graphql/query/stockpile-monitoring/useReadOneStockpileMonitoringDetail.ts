import { ApolloError, gql, useQuery } from '@apollo/client';

import { IReadOneStockpileDomeMaster } from '@/services/graphql/query/stockpile-master/useReadOneStockpileDomeMaster';

import { IFile, IStatus } from '@/types/global';

export const READ_ONE_STOCKPILE_MONITORING_DETAIL = gql`
  query ReadOneStockpileMonitoringDetail($id: String!) {
    monitoringStockpileDetail(id: $id) {
      id
      status {
        id
        name
      }
      statusMessage
      createdAt
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
      desc
      photo {
        id
        originalFileName
        url
        fileName
      }
    }
  }
`;

export interface IReadOneStockpileMonitoringDetail {
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
  desc: string | null;
  photo: Omit<IFile, 'mime' | 'path'> | null;
  status: IStatus | null;
  statusMessage: string | null;
  createdAt: string | null;
}

interface IReadOneStockpileMonitoringDetailResponse {
  monitoringStockpileDetail: IReadOneStockpileMonitoringDetail;
}

interface IReadOneStockpileMonitoringDetailRequest {
  id: string;
}

export const useReadOneStockpileMonitoringDetail = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: IReadOneStockpileMonitoringDetailRequest;
  skip?: boolean;
  onCompleted?: (data: IReadOneStockpileMonitoringDetailResponse) => void;
}) => {
  const {
    data: monitoringStockpileDetail,
    loading: monitoringStockpileDetailLoading,
  } = useQuery<
    IReadOneStockpileMonitoringDetailResponse,
    IReadOneStockpileMonitoringDetailRequest
  >(READ_ONE_STOCKPILE_MONITORING_DETAIL, {
    variables,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted: onCompleted,
    skip,
    fetchPolicy: 'cache-and-network',
  });

  return {
    monitoringStockpileDetail:
      monitoringStockpileDetail?.monitoringStockpileDetail,
    monitoringStockpileDetailLoading,
  };
};
