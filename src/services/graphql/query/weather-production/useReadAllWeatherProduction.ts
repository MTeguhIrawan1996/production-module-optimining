import { ApolloError, gql, useQuery } from '@apollo/client';

import { ILocationsData } from '@/services/graphql/query/location/useReadAllLocationMaster';

import { GResponse, IGlobalMetaRequest, IStatus } from '@/types/global';

export const READ_ALL_WEATHER_PRODUCTION = gql`
  query ReadAllWeatherProduction(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
    $year: Float
    $week: Float
  ) {
    weatherDatas(
      findAllWeatherDataInput: {
        page: $page
        limit: $limit
        search: $search
        orderBy: $orderBy
        orderDir: $orderDir
        year: $year
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

interface IReadAllWeatherProductionRequest extends IGlobalMetaRequest {
  year: number | null;
  week: number | null;
}

export const useReadAllWeatherProduction = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: Partial<IReadAllWeatherProductionRequest>;
  onCompleted?: (data: IReadAllWeatherProductionResponse) => void;
  skip?: boolean;
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
    fetchPolicy: 'cache-and-network',
  });

  return {
    weatherData: weatherData?.weatherDatas.data,
    weatherDataMeta: weatherData?.weatherDatas.meta,
    weatherDataLoading,
    refetchWeatherData: refetch,
  };
};
