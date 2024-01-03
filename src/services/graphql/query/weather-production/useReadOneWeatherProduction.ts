import { ApolloError, gql, useQuery } from '@apollo/client';

import { ILocationsData } from '@/services/graphql/query/location/useReadAllLocationMaster';

import { IStatus } from '@/types/global';

export const READ_ONE_WEATHER_PRODUCTION = gql`
  query ReadOneWeatherProduction($id: String!) {
    weatherData(id: $id) {
      id
      date
      checker {
        id
        nip
        humanResource {
          id
          name
        }
      }
      location {
        id
        name
      }
      weatherDataConditions {
        id
        condition {
          id
          name
        }
        startAt
        finishAt
        rainfall
      }
      checkerDate
      statusMessage
      desc
      status {
        id
        name
      }
    }
  }
`;

type IWeatherConditions = {
  id: string;
  condition: {
    id: string;
    name: string;
  } | null;
  startAt: string | null;
  finishAt: string | null;
  rainfall: number;
};

interface IReadOneWeatherProduction {
  id: string;
  date: string | null;
  location: Pick<ILocationsData, 'id' | 'name'> | null;
  checker: {
    id: string;
    nip: string | null;
    humanResource: {
      id: string;
      name: string;
    };
  } | null;
  weatherDataConditions: IWeatherConditions[];
  checkerDate: string | null;
  status: IStatus | null;
  statusMessage: string | null;
  desc: string | null;
}

interface IReadOneWeatherProductionResponse {
  weatherData: IReadOneWeatherProduction;
}

interface IReadOneWeatherProductionRequest {
  id: string;
}

export const useReadOneWeatherProduction = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: IReadOneWeatherProductionRequest;
  skip?: boolean;
  onCompleted?: (data: IReadOneWeatherProductionResponse) => void;
}) => {
  const { data: weatherData, loading: weatherDataLoading } = useQuery<
    IReadOneWeatherProductionResponse,
    IReadOneWeatherProductionRequest
  >(READ_ONE_WEATHER_PRODUCTION, {
    variables,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted: onCompleted,
    skip,
    fetchPolicy: 'cache-and-network',
  });

  return {
    weatherData: weatherData?.weatherData,
    weatherDataLoading,
  };
};
