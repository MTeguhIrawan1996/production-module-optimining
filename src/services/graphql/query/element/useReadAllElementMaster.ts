import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

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

export interface IElementsData {
  id: string;
  name: string;
}

interface IElementsResponse {
  elements: GResponse<IElementsData>;
}

export const useReadAllElementMaster = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: Partial<IGlobalMetaRequest>;
  onCompleted?: (data: IElementsResponse) => void;
  skip?: boolean;
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
      fetchPolicy: 'cache-and-network',
    }
  );

  return {
    elementsData: elementsData?.elements.data,
    elementsDataMeta: elementsData?.elements.meta,
    elementsDataLoading,
    refetchElements: refetch,
  };
};
