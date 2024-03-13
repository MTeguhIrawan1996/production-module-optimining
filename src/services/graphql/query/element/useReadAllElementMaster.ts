import {
  ApolloError,
  gql,
  useQuery,
  WatchQueryFetchPolicy,
} from '@apollo/client';

import { GResponse, IElementsData, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_ELEMENT_MASTER = gql`
  query ReadAllElement(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
  ) {
    elements(
      findAllElementInput: {
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

interface IElementsResponse {
  elements: GResponse<IElementsData>;
}

export const useReadAllElementMaster = ({
  variables,
  onCompleted,
  skip,
  fetchPolicy = 'cache-first',
}: {
  variables?: Partial<IGlobalMetaRequest>;
  onCompleted?: (data: IElementsResponse) => void;
  skip?: boolean;
  fetchPolicy?: WatchQueryFetchPolicy;
}) => {
  const {
    data: elementsData,
    loading: elementsDataLoading,
    refetch,
  } = useQuery<IElementsResponse, Partial<IGlobalMetaRequest>>(
    READ_ALL_ELEMENT_MASTER,
    {
      variables: variables,
      skip: skip,
      onError: (err: ApolloError) => {
        return err;
      },
      onCompleted,
      fetchPolicy,
    }
  );

  return {
    elementsData: elementsData?.elements.data,
    elementsDataMeta: elementsData?.elements.meta,
    elementsDataLoading,
    refetchElements: refetch,
  };
};
