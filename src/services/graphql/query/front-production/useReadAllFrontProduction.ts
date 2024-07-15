import {
  ApolloError,
  gql,
  useQuery,
  WatchQueryFetchPolicy,
} from '@apollo/client';

import { IHeavyEquipmentCompany } from '@/services/graphql/query/heavy-equipment/useReadAllHeavyEquipmentCompany';
import { ILocationsData } from '@/services/graphql/query/location/useReadAllLocationMaster';
import { formatDate } from '@/utils/helper/dateFormat';
import { simpleOtherColumn } from '@/utils/helper/simpleOtherColumn';

import { GResponse, IGlobalMetaRequest, IStatus } from '@/types/global';

export const READ_ALL_FRONT_PRODUCTION = gql`
  query ReadAllFrontProduction(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
    $shiftId: String
    $pitId: String
    $materialId: String
    $domeId: String
    $type: String
    $timeFilterType: TimeFilterTypeDownloadEnum
    $timeFilter: JSON
  ) {
    frontDatas(
      findAllFrontDataInput: {
        page: $page
        limit: $limit
        search: $search
        orderBy: $orderBy
        orderDir: $orderDir
        shiftId: $shiftId
        pitId: $pitId
        materialId: $materialId
        domeId: $domeId
        type: $type
        timeFilterType: $timeFilterType
        timeFilter: $timeFilter
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
        material {
          id
          name
          parent {
            id
            name
          }
        }
        front {
          id
          name
        }
        companyHeavyEquipment {
          id
          hullNumber
          heavyEquipment {
            id
            class {
              id
              name
            }
          }
        }
        pit {
          id
          name
        }
        dome {
          id
          name
        }
        x
        y
        status {
          id
          name
          color
        }
      }
    }
  }
`;

export interface IReadAllFrontProductionData {
  id: string;
  date: string | null;
  material: {
    id: string;
    name: string;
    parent: {
      id: string;
      name: string;
    } | null;
  } | null;
  front: Pick<ILocationsData, 'id' | 'name'> | null;
  companyHeavyEquipment: IHeavyEquipmentCompany | null;
  pit: {
    id: string;
    name: string;
  } | null;
  dome: {
    id: string;
    name: string;
  } | null;
  x: number | null;
  y: number | null;
  status: IStatus | null;
}

interface IReadAllFrontProductionResponse {
  frontDatas: GResponse<IReadAllFrontProductionData>;
}

interface IReadAllFrontProductionRequest extends IGlobalMetaRequest {
  date: string | null;
  type: string | null;
  timeFilterType: string | null;
  timeFilter: {
    startDate?: string | null;
    endDate?: string;
    year?: number;
    week?: number;
    month?: number;
  };
  shiftId: string | null;
  pitId: string | null;
  materialId: string | null;
  domeId: string | null;
}

interface ISimpleKeyType {
  id: string;
  date: string | null;
  material: string | null;
  frontName: string | null;
  heavyEquipmentCode: string | null;
  class: string | null;
  coordinateX: number | null;
  coordinateY: number | null;
  pit: string | null;
  dome: string | null;
  status: IStatus | null;
}

export const useReadAllFrontProduction = ({
  variables,
  onCompleted,
  skip,
  fetchPolicy = 'cache-first',
}: {
  variables?: Partial<IReadAllFrontProductionRequest>;
  onCompleted?: (data: IReadAllFrontProductionResponse) => void;
  skip?: boolean;
  fetchPolicy?: WatchQueryFetchPolicy;
}) => {
  const {
    data: frontProductionData,
    loading: frontProductionDataLoading,
    refetch,
  } = useQuery<
    IReadAllFrontProductionResponse,
    Partial<IReadAllFrontProductionRequest>
  >(READ_ALL_FRONT_PRODUCTION, {
    variables: variables,
    skip: skip,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted,
    fetchPolicy,
    notifyOnNetworkStatusChange: true,
  });

  const simplifiedData: ISimpleKeyType[] | undefined =
    frontProductionData?.frontDatas.data.map((item) => {
      const isHaveParent = item.material?.parent ? true : false;
      const material = item.material?.name || null;
      const parent = item.material?.parent?.name || null;
      return {
        id: item.id,
        date: formatDate(item.date),
        material: isHaveParent ? parent : material,
        frontName: item.front?.name ?? null,
        class: item.companyHeavyEquipment?.heavyEquipment?.class?.name ?? null,
        heavyEquipmentCode: item.companyHeavyEquipment?.hullNumber ?? null,
        dome: item.dome?.name ?? null,
        pit: item.pit?.name ?? null,
        coordinateX: item.x ?? null,
        coordinateY: item.y ?? null,
        status: item.status,
      };
    });
  const excludeAccessor = [
    'status',
    'id',
    `${variables?.type === 'pit' ? 'dome' : 'pit'}`,
  ];

  const otherColumn = simpleOtherColumn({
    data: simplifiedData,
    exclude: excludeAccessor,
  });

  return {
    frontProductionData: simplifiedData,
    frontProductionOtherColumn: otherColumn,
    frontProductionDataMeta: frontProductionData?.frontDatas.meta,
    frontProductionDataLoading,
    refetchfrontProductionData: refetch,
  };
};
