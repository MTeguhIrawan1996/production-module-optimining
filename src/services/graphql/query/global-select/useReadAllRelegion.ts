import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_RELEGION = gql`
  query ReadAllRelegion(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
  ) {
    religions(
      findAllReligionInput: {
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

export interface IRelegionData {
  id: string;
  name: string;
  slug: string;
}

interface IReligionsResponse {
  religions: GResponse<IRelegionData>;
}

export const useReadAllRelegion = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: Partial<IGlobalMetaRequest>;
  onCompleted?: (data: IReligionsResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: relegionsData,
    loading: relegionsDataLoading,
    refetch,
  } = useQuery<IReligionsResponse, Partial<IGlobalMetaRequest>>(
    READ_ALL_RELEGION,
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
    relegionsData: relegionsData?.religions.data,
    relegionsDataMeta: relegionsData?.religions.meta,
    relegionsDataLoading,
    refetchRelegionsData: refetch,
  };
};
