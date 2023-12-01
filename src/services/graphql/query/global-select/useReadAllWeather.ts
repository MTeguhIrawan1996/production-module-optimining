import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_WEATHER = gql`
  query ReadAllWeather(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
  ) {
    weathers(
      findAllWeatherInput: {
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
      }
    }
  }
`;

export interface IWeathersData {
  id: string;
  name: string;
}

interface IWeathersResponse {
  weathers: GResponse<IWeathersData>;
}

export const useReadAllWeather = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: Partial<IGlobalMetaRequest>;
  onCompleted?: (data: IWeathersResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: weathersData,
    loading: weathersDataLoading,
    refetch,
  } = useQuery<IWeathersResponse, Partial<IGlobalMetaRequest>>(
    READ_ALL_WEATHER,
    {
      variables: variables,
      skip: skip,
      onError: (err: ApolloError) => {
        return err;
      },
      onCompleted,
      fetchPolicy: 'cache-first',
    }
  );

  return {
    weathersData: weathersData?.weathers.data,
    weathersDataMeta: weathersData?.weathers.meta,
    weathersDataLoading,
    refetchweathersData: refetch,
  };
};
