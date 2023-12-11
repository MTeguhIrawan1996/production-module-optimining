import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_LOCATION_MASTER = gql`
  query ReadAllLocation(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
    $categoryId: String
  ) {
    locations(
      findAllLocationInput: {
        page: $page
        limit: $limit
        search: $search
        orderBy: $orderBy
        orderDir: $orderDir
        categoryId: $categoryId
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
        handBookId
        category {
          id
          name
        }
      }
    }
  }
`;

export interface ILocationsData {
  id: string;
  name: string;
  handBookId: string;
  category: {
    id: string;
    name: string;
  } | null;
}

interface ILocationsResponse {
  locations: GResponse<ILocationsData>;
}

interface ILocationsRequest extends Partial<IGlobalMetaRequest> {
  categoryId?: string | null;
}

export const useReadAllLocationsMaster = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: ILocationsRequest;
  onCompleted?: (data: ILocationsResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: locationsData,
    loading: locationsDataLoading,
    refetch,
  } = useQuery<ILocationsResponse, ILocationsRequest>(
    READ_ALL_LOCATION_MASTER,
    {
      variables: variables,
      skip: skip,
      onError: (err: ApolloError) => {
        return err;
      },
      onCompleted,
      fetchPolicy: 'cache-and-network',
    }
  );

  return {
    locationsData: locationsData?.locations.data,
    locationsDataMeta: locationsData?.locations.meta,
    locationsDataLoading,
    refetchLocations: refetch,
  };
};
