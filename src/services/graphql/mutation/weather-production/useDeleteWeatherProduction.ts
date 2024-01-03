import { ApolloError, gql, useMutation } from '@apollo/client';

export const DELETE_WEATHER_PRODUCTION = gql`
  mutation DeleteWeatherProduction($id: String!) {
    deleteWeatherData(id: $id)
  }
`;

export interface IDeleteWeatherProductionRequest {
  id: string;
}

interface IDeleteWeatherProductionResponse {
  deleteWeatherData: boolean;
}

export const useDeleteWeatherProduction = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IDeleteWeatherProductionResponse) => void;
}) => {
  return useMutation<
    IDeleteWeatherProductionResponse,
    IDeleteWeatherProductionRequest
  >(DELETE_WEATHER_PRODUCTION, {
    onError,
    onCompleted,
  });
};
