import {
  ApolloError,
  gql,
  useQuery,
  WatchQueryFetchPolicy,
} from '@apollo/client';

import { ILocationsData } from '@/services/graphql/query/location/useReadAllLocationMaster';

import {
  GResponse,
  IGlobalMetaRequest,
  IGlobalTimeFIlter,
  IStatus,
} from '@/types/global';

export const READ_ALL_WEATHER_PRODUCTION = gql`
  query ReadAllWeatherProduction(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
    $shiftId: String
    $timeFilterType: TimeFilterTypeDownloadEnum
    $timeFilter: JSON
  ) {
    weatherDatas(
      findAllWeatherDataInput: {
        page: $page
        limit: $limit
        search: $search
        orderBy: $orderBy
        orderDir: $orderDir
        shiftId: $shiftId
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
        location {
          id
          name
        }
        detailWeatherData {
          slipperyTotal
          rainTotal
          loseTotal
          availabilityHourPerDay
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

export interface IReadAllWeatherProductionData {
  id: string;
  date: string | null;
  location: Pick<ILocationsData, 'id' | 'name'> | null;
  detailWeatherData: {
    slipperyTotal: number | null;
    rainTotal: number | null;
    loseTotal: number | null;
    availabilityHourPerDay: number | null;
  };
  status: IStatus | null;
}

interface IReadAllWeatherProductionResponse {
  weatherDatas: GResponse<IReadAllWeatherProductionData>;
}

export interface IReadAllWeatherProductionRequest extends IGlobalMetaRequest {
  shiftId: string | null;
  timeFilterType: 'DATE_RANGE' | 'PERIOD' | null;
  timeFilter: Partial<IGlobalTimeFIlter>;
}

export const useReadAllWeatherProduction = ({
  variables,
  onCompleted,
  skip,
  fetchPolicy = 'cache-first',
}: {
  variables?: Partial<IReadAllWeatherProductionRequest>;
  onCompleted?: (data: IReadAllWeatherProductionResponse) => void;
  skip?: boolean;
  fetchPolicy?: WatchQueryFetchPolicy;
}) => {
  const {
    data: weatherData,
    loading: weatherDataLoading,
    refetch,
  } = useQuery<
    IReadAllWeatherProductionResponse,
    Partial<IReadAllWeatherProductionRequest>
  >(READ_ALL_WEATHER_PRODUCTION, {
    variables: variables,
    skip: skip,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted,
    fetchPolicy,
    notifyOnNetworkStatusChange: true,
  });

  return {
    weatherData: weatherData?.weatherDatas.data,
    weatherDataMeta: weatherData?.weatherDatas.meta,
    weatherDataLoading,
    refetchWeatherData: refetch,
  };
};
