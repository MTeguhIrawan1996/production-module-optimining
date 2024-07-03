import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ONE_SHIPPING_MONITORING_BRGING_RITAGE_LIST = gql`
  query ReadOneShippingMonitoringBargingRitageList(
    $id: String!
    $page: Int
    $limit: Int
    $orderBy: String
    $orderDir: String
  ) {
    monitoringBargingRitage(
      findAllBargingRitageInput: {
        page: $page
        limit: $limit
        orderBy: $orderBy
        orderDir: $orderDir
        monitoringBargingId: $id
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
        date
        tonByRitage
        shift {
          id
          name
        }
        companyHeavyEquipment {
          id
          hullNumber
        }
      }
    }
  }
`;

export type IShippingMonitoringBargingRitageData = {
  id: string;
  date: string;
  tonByRitage: number | null;
  shift: {
    id: string;
    name: string;
  };
  companyHeavyEquipment: {
    id: string;
    hullNumber: string;
  };
};

interface IReadOneShippingMonitoringBargingRitageListResponse {
  monitoringBargingRitage: GResponse<IShippingMonitoringBargingRitageData>;
}

interface IReadOneShippingMonitoringBargingRitageListRequest
  extends Partial<IGlobalMetaRequest> {
  id: string;
}

export const useReadOneShippingMonitoringBargingRitageList = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: IReadOneShippingMonitoringBargingRitageListRequest;
  skip?: boolean;
  onCompleted?: (
    data: IReadOneShippingMonitoringBargingRitageListResponse
  ) => void;
}) => {
  const {
    data: monitoringBargingRitage,
    loading: monitoringBargingRitageLoading,
  } = useQuery<
    IReadOneShippingMonitoringBargingRitageListResponse,
    IReadOneShippingMonitoringBargingRitageListRequest
  >(READ_ONE_SHIPPING_MONITORING_BRGING_RITAGE_LIST, {
    variables,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted: onCompleted,
    skip,
    fetchPolicy: 'cache-first',
  });

  return {
    monitoringBargingRitage: monitoringBargingRitage?.monitoringBargingRitage,
    monitoringBargingRitageLoading,
  };
};
