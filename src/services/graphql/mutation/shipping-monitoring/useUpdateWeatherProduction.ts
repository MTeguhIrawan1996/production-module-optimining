import { ApolloError, gql, useMutation } from '@apollo/client';

import { IMutationWeatherProductionValues } from '@/services/graphql/mutation/weather-production/useCreateWeatherProduction';

export const UPDATE_WEATHER_PRODUCTION = gql`
  mutation UpdateWeatherProduction(
    $id: String!
    $date: String
    $checkerId: String
    $locationCategoryId: String
    $locationId: String
    $desc: String
    $weatherDataConditions: [CreateWeatherDataConditionDto!]
  ) {
    updateWeatherData(
      updateWeatherDataInput: {
        id: $id
        date: $date
        checkerId: $checkerId
        locationCategoryId: $locationCategoryId
        locationId: $locationId
        desc: $desc
        weatherDataConditions: $weatherDataConditions
      }
    ) {
      id
    }
  }
`;

type IUpdateWeatherProductionRequest = {
  id: string;
} & IMutationWeatherProductionValues;

interface IUpdateWeatherProductionResponse {
  updateWeatherData: {
    id: string;
  };
}

export const useUpdateWeatherProduction = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateWeatherProductionResponse) => void;
}) => {
  return useMutation<
    IUpdateWeatherProductionResponse,
    IUpdateWeatherProductionRequest
  >(UPDATE_WEATHER_PRODUCTION, {
    onError,
    onCompleted,
  });
};
