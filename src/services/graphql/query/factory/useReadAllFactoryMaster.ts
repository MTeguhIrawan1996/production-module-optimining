import {
  ApolloError,
  gql,
  useQuery,
  WatchQueryFetchPolicy,
} from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_FACTORY_MASTER = gql`
  query ReadAllFactory(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
    $categoryId: String
  ) {
    factories(
      findAllFactoryInput: {
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
      }
    }
  }
`;

interface IFactoriesData {
  id: string;
  name: string;
}

interface IFactoriesResponse {
  factories: GResponse<IFactoriesData>;
}

interface IFactoriesRequest extends Partial<IGlobalMetaRequest> {
  categoryId?: string | null;
}

export const useReadAllFactoryMaster = ({
  variables,
  onCompleted,
  skip,
  fetchPolicy = 'cache-first',
}: {
  variables?: IFactoriesRequest;
  onCompleted?: (data: IFactoriesResponse) => void;
  skip?: boolean;
  fetchPolicy?: WatchQueryFetchPolicy;
}) => {
  const {
    data: factoriesData,
    loading: factoriesDataLoading,
    refetch,
  } = useQuery<IFactoriesResponse, IFactoriesRequest>(READ_ALL_FACTORY_MASTER, {
    variables: variables,
    skip: skip,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted,
    fetchPolicy,
  });

  return {
    factoriesData: factoriesData?.factories.data,
    factoriesDataMeta: factoriesData?.factories.meta,
    factoriesDataLoading,
    refetchFactories: refetch,
  };
};
