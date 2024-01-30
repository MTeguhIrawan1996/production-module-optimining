import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_LOCATION_SELECT = gql`
  query ReadAllLocationSelect(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
    $categoryId: String
  ) {
    allLocations(
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

export interface ILocationsSelectData {
  id: string;
  name: string;
  handBookId: string;
  category: {
    id: string;
    name: string;
  } | null;
}

interface ILocationSelectResponse {
  allLocations: GResponse<ILocationsSelectData>;
}

interface IAllLocationsRequest extends Partial<IGlobalMetaRequest> {
  categoryId?: string | null;
}

export const useReadAllLocationselect = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: IAllLocationsRequest;
  onCompleted?: (data: ILocationSelectResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: allLocationsData,
    loading: allLocationsDataLoading,
    refetch,
  } = useQuery<ILocationSelectResponse, IAllLocationsRequest>(
    READ_ALL_LOCATION_SELECT,
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
    allLocationsData: allLocationsData?.allLocations.data,
    allLocationsDataMeta: allLocationsData?.allLocations.meta,
    allLocationsDataLoading,
    refetchAllLocations: refetch,
  };
};
