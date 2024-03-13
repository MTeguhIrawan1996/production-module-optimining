import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_MAP_LOCATION = gql`
  query mapDataLocation(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
  ) {
    mapDataLocations(
      input: {
        page: $page
        limit: $limit
        search: $search
        orderBy: $orderBy
        orderDir: $orderDir
      }
    ) {
      data {
        locationId
        name
        category
      }
      additional
      meta {
        currentPage
        totalPage
        totalData
        totalAllData
      }
    }
  }
`;

export interface IMapLocationData {
  locationId: string;
  name: string;
  category: string;
}

interface IMapLocationResponse {
  mapDataLocations: GResponse<IMapLocationData>;
}

export const useReadAllMapLocation = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: Partial<IGlobalMetaRequest>;
  onCompleted?: (data: IMapLocationResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: mapLocationData,
    loading: mapLocationDataLoading,
    refetch,
  } = useQuery<IMapLocationResponse>(READ_ALL_MAP_LOCATION, {
    variables: variables,
    skip: skip,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted,
    fetchPolicy: 'cache-and-network',
  });

  return {
    mapLocationData: mapLocationData?.mapDataLocations.data,
    mapLocationMeta: mapLocationData?.mapDataLocations.meta,
    mapLocationDataLoading,
    refetchLocations: refetch,
  };
};
