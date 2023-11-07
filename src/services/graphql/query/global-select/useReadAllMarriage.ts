import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_MARRIAGE = gql`
  query ReadAllMarriage(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
  ) {
    marriageStatuses(
      findAllMarriageStatusInput: {
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

export interface IMarriageData {
  id: string;
  name: string;
  slug: string;
}

interface IMarriageStatusesResponse {
  marriageStatuses: GResponse<IMarriageData>;
}

export const useReadAllMarriage = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: Partial<IGlobalMetaRequest>;
  onCompleted?: (data: IMarriageStatusesResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: marriageData,
    loading: marriageDataLoading,
    refetch,
  } = useQuery<IMarriageStatusesResponse, Partial<IGlobalMetaRequest>>(
    READ_ALL_MARRIAGE,
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
    marriageData: marriageData?.marriageStatuses.data,
    marriageDataMeta: marriageData?.marriageStatuses.meta,
    marriageDataLoading,
    refetchMarriageData: refetch,
  };
};
