import { ApolloError, gql, useMutation } from '@apollo/client';

import { IUpdateStatusValues } from '@/types/global';

export const UPDATE_ISVALID_WEATHER_PRODUCTION = gql`
  mutation UpdateIsValidateWeatherProduction(
    $id: String!
    $status: Boolean
    $statusMessage: String
  ) {
    validateWeatherData(
      validateWeatherDataInput: {
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

export interface IUpdateIsValidateWeatherProductionRequest
  extends IUpdateStatusValues {
  id: string;
  status: boolean;
}

interface IUpdateIsValidateWeatherProductionResponse {
  validateWeatherData: {
    id: string;
    status: {
      id: string;
    };
  };
}

export const useUpdateIsValidateWeatherProduction = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateIsValidateWeatherProductionResponse) => void;
}) => {
  return useMutation<
    IUpdateIsValidateWeatherProductionResponse,
    IUpdateIsValidateWeatherProductionRequest
  >(UPDATE_ISVALID_WEATHER_PRODUCTION, {
    onError,
    onCompleted,
  });
};
