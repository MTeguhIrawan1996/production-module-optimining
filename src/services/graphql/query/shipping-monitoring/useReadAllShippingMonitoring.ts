import {
  ApolloError,
  gql,
  useQuery,
  WatchQueryFetchPolicy,
} from '@apollo/client';

import { formatDate } from '@/utils/helper/dateFormat';
import { simpleOtherColumn } from '@/utils/helper/simpleOtherColumn';

import { GResponse, IGlobalMetaRequest, IStatus } from '@/types/global';

export const READ_ALL_SHIPPING_MONITORING = gql`
  query ReadAllShippingMonitoring(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
    $bargeHeavyEquipmentId: String
    $factoryCategoryId: String
    $year: Float
    $month: Float
    $week: Float
  ) {
    monitoringBargings(
      findAllMonitoringBargingInput: {
        page: $page
        limit: $limit
        search: $search
        orderBy: $orderBy
        orderDir: $orderDir
        bargeHeavyEquipmentId: $bargeHeavyEquipmentId
        factoryCategoryId: $factoryCategoryId
        year: $year
        month: $month
        week: $week
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
        bargeHeavyEquipment {
          id
          hullNumber
        }
        palkaOpenAt
        palkaCloseAt
        vesselOpenAt
        vesselCloseAt
        factoryCategory {
          id
          name
        }
        factory {
          id
          name
        }
        status {
          id
          name
          color
        }
      }
    }
  }
`;

export interface IReadAllShippingMonitoringData {
  id: string;
  bargeHeavyEquipment: {
    id: string;
    hullNumber: string;
  } | null;
  palkaOpenAt: string | null;
  palkaCloseAt: string | null;
  vesselOpenAt: string | null;
  vesselCloseAt: string | null;
  factoryCategory: {
    id: string;
    name: string;
  } | null;
  factory: {
    id: string;
    name: string;
  } | null;
  status: IStatus | null;
}

interface IReadAllShippingMonitoringResponse {
  monitoringBargings: GResponse<IReadAllShippingMonitoringData>;
}

interface IReadAllShippingMonitoringRequest extends IGlobalMetaRequest {
  year: number | null;
  month: number | null;
  week: number | null;
  factoryCategoryId: string | null;
  bargeHeavyEquipmentId: string | null;
}

interface ISimpleKeyType {
  id: string;
  bargeCode: string | null;
  openPalka: string | null;
  openPalkaHour: string | null;
  closePalka: string | null;
  closePalkaHour: string | null;
  arrive: string | null;
  vesselNameOrFactoryName: string | null;
  status: IStatus | null;
}

export const useReadAllShippingMonitoring = ({
  variables,
  onCompleted,
  skip,
  fetchPolicy = 'cache-first',
}: {
  variables?: Partial<IReadAllShippingMonitoringRequest>;
  onCompleted?: (data: IReadAllShippingMonitoringResponse) => void;
  skip?: boolean;
  fetchPolicy?: WatchQueryFetchPolicy;
}) => {
  const {
    data: monitoringBargingData,
    loading: monitoringBargingDataLoading,
    refetch,
  } = useQuery<
    IReadAllShippingMonitoringResponse,
    Partial<IReadAllShippingMonitoringRequest>
  >(READ_ALL_SHIPPING_MONITORING, {
    variables: variables,
    skip: skip,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted,
    fetchPolicy,
  });

  const simplifiedData: ISimpleKeyType[] | undefined =
    monitoringBargingData?.monitoringBargings.data.map((item) => ({
      id: item.id,
      bargeCode: item.bargeHeavyEquipment?.hullNumber ?? null,
      openPalka: formatDate(item.palkaOpenAt),
      openPalkaHour: formatDate(item.palkaOpenAt, 'hh:mm:ss A'),
      closePalka: formatDate(item.palkaCloseAt),
      closePalkaHour: formatDate(item.palkaCloseAt, 'hh:mm:ss A'),
      arrive: item.factoryCategory?.name ?? null,
      vesselNameOrFactoryName: item.factory?.name ?? null,
      status: item.status,
    }));
  const excludeAccessor = ['status', 'id'];

  const otherColumn = simpleOtherColumn({
    data: simplifiedData,
    exclude: excludeAccessor,
  });

  return {
    monitoringBargingData: simplifiedData,
    monitoringBargingOtherColumn: otherColumn,
    monitoringBargingDataMeta: monitoringBargingData?.monitoringBargings.meta,
    monitoringBargingDataLoading,
    refetchMonitoringBargingData: refetch,
  };
};
