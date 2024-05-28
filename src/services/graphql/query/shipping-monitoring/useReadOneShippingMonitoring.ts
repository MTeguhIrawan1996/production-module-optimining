import { ApolloError, gql, useQuery } from '@apollo/client';

import { IReadAllShippingMonitoringData } from '@/services/graphql/query/shipping-monitoring/useReadAllShippingMonitoring';
import { formatDate } from '@/utils/helper/dateFormat';

import { IFile, IGroupingDetail } from '@/types/global';

export const READ_ONE_SHIPPING_MONITORING = gql`
  query ReadOneShippingMonitoring($id: String!) {
    monitoringBarging(id: $id) {
      id
      createdAt
      bargeHeavyEquipment {
        id
        hullNumber
      }
      tugboatHeavyEquipment {
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
      photo {
        id
        originalFileName
        url
        fileName
      }
      statusMessage
      tonByDraft
      totalRitages
      tonByRitages
      truckFactor
      bargingRitages {
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
      domes {
        id
        name
        totalRitages
        tonRitages
        monitoringStockpile {
          # tonByRitage
          ritageSamples {
            additional
          }
          # ritages {
          #   meta {
          #     totalAllData
          #   }
          # }
        }
      }
      desc
      status {
        id
        name
      }
    }
  }
`;

export type IDomesShipping = {
  id: string;
  name: string;
  totalRitages: number | null;
  tonRitages: number | null;
  monitoringStockpile: {
    // tonByRitage: number | null;
    // ritages: {
    //   meta: {
    //     totalAllData: number;
    //   };
    // };
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

export interface IReadOneShippingMonitoringData
  extends IReadAllShippingMonitoringData {
  id: string;
  createdAt: string | null;
  tugboatHeavyEquipment: {
    id: string;
    hullNumber: string;
  } | null;
  statusMessage: string | null;
  tonByDraft: number | null;
  totalRitages: number | null;
  tonByRitages: number | null;
  truckFactor: number | null;
  bargingRitages: {
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
  }[];
  domes: IDomesShipping[];
  photo: Omit<IFile, 'mime' | 'path'> | null;
  desc: string | null;
}

interface IReadOneShippingMonitoringResponse {
  monitoringBarging: IReadOneShippingMonitoringData;
}

interface IReadOneShippingMonitoringRequest {
  id: string;
}

export const useReadOneShippingMonitoring = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: IReadOneShippingMonitoringRequest;
  skip?: boolean;
  onCompleted?: (data: IReadOneShippingMonitoringResponse) => void;
}) => {
  const { data: monitoringBarging, loading: monitoringBargingLoading } =
    useQuery<
      IReadOneShippingMonitoringResponse,
      IReadOneShippingMonitoringRequest
    >(READ_ONE_SHIPPING_MONITORING, {
      variables,
      onError: (err: ApolloError) => {
        return err;
      },
      onCompleted: onCompleted,
      skip,
      fetchPolicy: 'cache-and-network',
    });

  const grouping: IGroupingDetail[] = [
    {
      group: 'shippingInformation',
      withDivider: true,
      enableTitle: true,
      itemValue: [
        {
          name: 'bargeCode',
          value:
            monitoringBarging?.monitoringBarging.bargeHeavyEquipment
              ?.hullNumber,
        },
        {
          name: 'tugboatCode',
          value:
            monitoringBarging?.monitoringBarging.tugboatHeavyEquipment
              ?.hullNumber,
        },
        {
          name: 'totalRitage2',
          value: `${monitoringBarging?.monitoringBarging.totalRitages || '-'}`,
        },
        {
          name: 'tonByRitage',
          value: `${monitoringBarging?.monitoringBarging.tonByRitages || '-'}`,
        },
        {
          name: 'tonByDraft',
          value: `${monitoringBarging?.monitoringBarging.tonByDraft || '-'}`,
        },
        {
          name: 'truckFactor',
          value: `${monitoringBarging?.monitoringBarging.truckFactor || '-'}`,
        },
      ],
    },
    {
      group: 'palkaTime',
      withDivider: true,
      enableTitle: true,
      itemValue: [
        {
          name: 'openPalka',
          value:
            formatDate(monitoringBarging?.monitoringBarging.palkaOpenAt) ?? '-',
        },
        {
          name: 'closePalka',
          value:
            formatDate(monitoringBarging?.monitoringBarging.palkaCloseAt) ??
            '-',
        },
        {
          name: 'openPalkaHour',
          value:
            formatDate(
              monitoringBarging?.monitoringBarging.palkaOpenAt,
              'hh:mm:ss A'
            ) ?? '-',
        },
        {
          name: 'closePalkaHour',
          value:
            formatDate(
              monitoringBarging?.monitoringBarging.palkaCloseAt,
              'hh:mm:ss A'
            ) ?? '-',
        },
      ],
    },
    {
      group: 'arrive',
      withDivider: true,
      enableTitle: true,
      itemValue: [
        {
          name: 'destination',
          value: monitoringBarging?.monitoringBarging.factoryCategory?.name,
        },
        {
          name: 'vesselNameOrFactoryName',
          value: monitoringBarging?.monitoringBarging.factory?.name,
        },
      ],
    },
    {
      group: 'desc',
      enableTitle: false,
      withDivider: true,
      itemValue: [
        {
          name: 'desc',
          value: monitoringBarging?.monitoringBarging.desc,
        },
      ],
    },
  ];

  return {
    monitoringBarging: monitoringBarging?.monitoringBarging,
    monitoringBargingGrouping: grouping,
    monitoringBargingLoading,
  };
};
