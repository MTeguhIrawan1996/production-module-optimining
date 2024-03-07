import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_MAP = gql`
  query mapDatas(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
    $dateType: MapDataDate!
    $mapDataCategoryId: String
    $mapDataLocationId: String
    $year: Float
    $week: Float
    $month: Float
    $quarter: Float
  ) {
    mapDatas(
      input: {
        page: $page
        limit: $limit
        search: $search
        orderBy: $orderBy
        orderDir: $orderDir
        dateType: $dateType
        mapDataCategoryId: $mapDataCategoryId
        mapDataLocationId: $mapDataLocationId
        year: $year
        week: $week
        month: $month
        quarter: $quarter
      }
    ) {
      data {
        id
        name
        dateType
        status
        year
        quarter
        month
        week
        mapDataLocation {
          locationId
          name
          category
        }
        mapDataCategory {
          id
          name
        }
      }
      additional
      meta {
        currentPage
        totalPage
        totalData
        totalAllData
      }
    }
  }
`;

export interface IMapData {
  id: string;
  name: string;
  dateType: string;
  status: 'WAITING_FOR_CONFIRMATION' | 'VALID' | 'INVALID' | 'ACCEPTED';
  year: string;
  quarter: string;
  month: string;
  week: string;
  mapDataLocation: Array<{
    locationId: string;
    name: string;
    category: string;
  }>;
  mapDataCategory: {
    id: string;
    name: string;
  };
}

interface IMapDataResponse {
  mapDatas: GResponse<IMapData>;
}

interface IMapDataRequest extends IGlobalMetaRequest {
  dateType: 'YEAR' | 'QUARTER' | 'MONTH' | 'WEEK';
  mapDataCategoryId?: string;
  mapDataLocationId?: string;
  year?: number;
  week?: number;
  month?: number;
  quarter?: number;
}

export const useReadAllMap = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: Partial<IMapDataRequest>;
  onCompleted?: (data: IMapDataResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: mapData,
    loading: mapDataLoading,
    refetch,
  } = useQuery<IMapDataResponse>(READ_ALL_MAP, {
    variables: variables,
    skip: skip,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted,
    fetchPolicy: 'cache-and-network',
  });

  return {
    mapData: mapData?.mapDatas.data,
    mapMeta: mapData?.mapDatas.meta,
    mapDataLoading,
    refetchMap: refetch,
  };
};
