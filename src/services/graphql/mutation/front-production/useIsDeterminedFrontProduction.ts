import { ApolloError, gql, useMutation } from '@apollo/client';

import { IUpdateStatusValues } from '@/types/global';

export const UPDATE_ISDETERMINED_WEATHER_PRODUCTION = gql`
  mutation UpdateIsDeterminedWeatherProduction(
    $id: String!
    $status: Boolean
    $statusMessage: String
  ) {
    determineWeatherData(
      determineWeatherDataInput: {
        id: $id
        status: $status
        statusMessage: $statusMessage
      }
    ) {
      id
      status {
        id
        name
      }
    }
  }
`;

export interface IUpdateIsDeterminedWeatherProductionRequest
  extends IUpdateStatusValues {
  id: string;
  status: boolean;
}

interface IUpdateIsDeterminedWeatherProductionResponse {
  determineWeatherData: {
    id: string;
    status: {
      id: string;
    };
  };
}

export const useUpdateIsDeterminedWeatherProduction = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateIsDeterminedWeatherProductionResponse) => void;
}) => {
  return useMutation<
    IUpdateIsDeterminedWeatherProductionResponse,
    IUpdateIsDeterminedWeatherProductionRequest
  >(UPDATE_ISDETERMINED_WEATHER_PRODUCTION, {
    onError,
    onCompleted,
  });
};
