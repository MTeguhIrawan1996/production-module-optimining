import { ApolloError, gql, useQuery } from '@apollo/client';

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
    $date: String
    $type: String
  ) {
    frontDatas(
      findAllFrontDataInput: {
        page: $page
        limit: $limit
        search: $search
        orderBy: $orderBy
        orderDir: $orderDir
        date: $date
        type: $type
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
        front {
          id
          name
        }
        companyHeavyEquipment {
          id
          hullNumber
          heavyEquipment {
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
}

interface ISimpleKeyType {
  id: string;
  date: string | null;
  front: string | null;
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
}: {
  variables?: Partial<IReadAllFrontProductionRequest>;
  onCompleted?: (data: IReadAllFrontProductionResponse) => void;
  skip?: boolean;
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
    fetchPolicy: 'cache-and-network',
  });

  const simplifiedData: ISimpleKeyType[] | undefined =
    frontProductionData?.frontDatas.data.map((item) => ({
      id: item.id,
      date: formatDate(item.date),
      heavyEquipmentCode: item.companyHeavyEquipment?.hullNumber ?? null,
      class: item.companyHeavyEquipment?.heavyEquipment?.class?.name ?? null,
      front: item.front?.name ?? null,
      dome: item.dome?.name ?? null,
      pit: item.pit?.name ?? null,
      coordinateX: item.x ?? null,
      coordinateY: item.y ?? null,
      status: item.status,
    }));
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
