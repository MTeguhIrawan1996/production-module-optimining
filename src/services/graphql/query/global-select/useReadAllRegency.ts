import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_REGENCY = gql`
  query ReadAllRegency(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
    $provinceId: String
  ) {
    regencies(
      findAllRegencyInput: {
        page: $page
        limit: $limit
        search: $search
        orderBy: $orderBy
        orderDir: $orderDir
        provinceId: $provinceId
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

export interface IRegencyData {
  id: string;
  name: string;
}

interface IRegenciesResponse {
  regencies: GResponse<IRegencyData>;
}

interface IRegencyRequest extends IGlobalMetaRequest {
  provinceId: string | null;
}

export const useReadAllRegency = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: Partial<IRegencyRequest>;
  onCompleted?: (data: IRegenciesResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: regenciesData,
    loading: regenciesDataLoading,
    refetch,
  } = useQuery<IRegenciesResponse, Partial<IRegencyRequest>>(READ_ALL_REGENCY, {
    variables: variables,
    skip: skip,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted,
    fetchPolicy: 'cache-first',
  });

  return {
    regenciesData: regenciesData?.regencies.data,
    regenciesDataMeta: regenciesData?.regencies.meta,
    regenciesDataLoading,
    refetchRegenciesData: refetch,
  };
};
