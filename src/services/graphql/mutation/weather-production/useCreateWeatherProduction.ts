import { ApolloError, gql, useMutation } from '@apollo/client';

export const CREATE_WEATHER_PRODUCTION = gql`
  mutation CreateWeatherProduction(
    $date: String
    $checkerId: String
    $locationCategoryId: String
    $locationId: String
    $desc: String
    $weatherDataConditions: [CreateWeatherDataConditionDto!]
  ) {
    createWeatherData(
      createWeatherDataInput: {
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

export interface IMutationWeatherProductionValues {
  date?: Date | string | null;
  checkerId: string | null;
  locationCategoryId: string | null;
  locationId: string | null;
  desc: string;
  weatherDataConditions: {
    conditionId: string | null;
    startTime: string;
    finishTime: string;
    rainfall: number | null | '';
  }[];
}

type ICreateWeatherProductionRequest = IMutationWeatherProductionValues;

interface ICreateWeatherProductionResponse {
  createWeatherData: {
    id: string;
  };
}

export const useCreateWeatherProduction = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: ICreateWeatherProductionResponse) => void;
}) => {
  return useMutation<
    ICreateWeatherProductionResponse,
    ICreateWeatherProductionRequest
  >(CREATE_WEATHER_PRODUCTION, {
    onError,
    onCompleted,
  });
};
