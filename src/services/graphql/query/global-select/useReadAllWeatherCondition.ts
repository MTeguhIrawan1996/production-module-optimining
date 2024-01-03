import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_WEATHER_CONDITION = gql`
  query ReadAllWeatherCondition(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
  ) {
    weatherConditions(
      findAllWeatherConditionInput: {
        page: $page
        limit: $limit
        search: $search
        orderBy: $orderBy
        orderDir: $orderDir
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
        name
        slug
      }
    }
  }
`;

export interface IReadAllWeatherConditionData {
  id: string;
  name: string;
  slug: string;
}

interface IReadAllWeatherConditionResponse {
  weatherConditions: GResponse<IReadAllWeatherConditionData>;
}

export const useReadAllWeatherCondition = ({
  variables,
  onCompleted,
}: {
  variables?: Partial<IGlobalMetaRequest>;
  onCompleted?: (data: IReadAllWeatherConditionResponse) => void;
}) => {
  const { data: weatherConditionsdata, loading: weatherConditionsLoading } =
    useQuery<IReadAllWeatherConditionResponse, Partial<IGlobalMetaRequest>>(
      READ_ALL_WEATHER_CONDITION,
      {
        variables: variables,
        onError: (err: ApolloError) => {
          return err;
        },
        onCompleted,
        fetchPolicy: 'cache-first',
      }
    );

  return {
    weatherConditionsdata: weatherConditionsdata?.weatherConditions.data,
    weatherConditionsMeta: weatherConditionsdata?.weatherConditions.meta,
    weatherConditionsLoading,
  };
};
