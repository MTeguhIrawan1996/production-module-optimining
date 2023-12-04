import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_PIT = gql`
  query ReadAllPit(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
  ) {
    pits(
      findAllPitInput: {
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
        handBookId
        name
      }
    }
  }
`;

export interface IReadAllPit {
  id: string;
  handBookId: string;
  name: string;
}

export interface IReadAllPitResponse {
  pits: GResponse<IReadAllPit>;
}

export const useReadAllPit = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: Partial<IGlobalMetaRequest>;
  skip?: boolean;
  onCompleted?: (data: IReadAllPitResponse) => void;
}) => {
  const {
    data: pitData,
    loading: pitDataLoading,
    refetch,
  } = useQuery<IReadAllPitResponse, Partial<IGlobalMetaRequest>>(READ_ALL_PIT, {
    variables,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted: onCompleted,
    skip,
    fetchPolicy: 'cache-and-network',
  });

  return {
    pit: pitData?.pits.data,
    pitMeta: pitData?.pits.meta,
    pitDataLoading,
    refetchPit: refetch,
  };
};
