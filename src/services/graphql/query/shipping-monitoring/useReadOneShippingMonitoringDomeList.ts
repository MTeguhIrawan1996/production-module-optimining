import { ApolloError, gql, useQuery } from '@apollo/client';

export const READ_ONE_SHIPPING_MONITORING_DOME_LIST = gql`
  query ReadOneShippingMonitoringDomeList($id: String!) {
    monitoringBargingDome(monitoringBargingId: $id) {
      id
      name
      totalRitages
      tonRitages
      monitoringStockpile {
        ritageSamples {
          additional
        }
      }
    }
  }
`;

export type IShippingMonitoringDomeData = {
  id: string;
  name: string;
  totalRitages: number | null;
  tonRitages: number | null;
  monitoringStockpile: {
    ritageSamples: {
      additional: {
        averageSamples: {
          id: string;
          name: string | null;
          value: number | null;
        }[];
      };
    };
  };
};

interface IReadOneShippingMonitoringDomeListResponse {
  monitoringBargingDome: IShippingMonitoringDomeData[];
}

interface IReadOneShippingMonitoringDomeListRequest {
  id: string;
}

export const useReadOneShippingMonitoringDomeList = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: IReadOneShippingMonitoringDomeListRequest;
  skip?: boolean;
  onCompleted?: (data: IReadOneShippingMonitoringDomeListResponse) => void;
}) => {
  const { data: monitoringBargingDome, loading: monitoringBargingDomeLoading } =
    useQuery<
      IReadOneShippingMonitoringDomeListResponse,
      IReadOneShippingMonitoringDomeListRequest
    >(READ_ONE_SHIPPING_MONITORING_DOME_LIST, {
      variables,
      onError: (err: ApolloError) => {
        return err;
      },
      onCompleted: onCompleted,
      skip,
      fetchPolicy: 'cache-and-network',
    });

  return {
    monitoringBargingDome: monitoringBargingDome?.monitoringBargingDome,
    monitoringBargingDomeLoading,
  };
};
