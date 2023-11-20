import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_FACTORY_MASTER = gql`
  query ReadAllFactory(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
  ) {
    factories(
      findAllFactoryInput: {
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

interface IFactoriesData {
  id: string;
  name: string;
}

interface IFactoriesResponse {
  factories: GResponse<IFactoriesData>;
}

export const useReadAllFactoryMaster = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: Partial<IGlobalMetaRequest>;
  onCompleted?: (data: IFactoriesResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: factoriesData,
    loading: factoriesDataLoading,
    refetch,
  } = useQuery<IFactoriesResponse, Partial<IGlobalMetaRequest>>(
    READ_ALL_FACTORY_MASTER,
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
    factoriesData: factoriesData?.factories.data,
    factoriesDataMeta: factoriesData?.factories.meta,
    factoriesDataLoading,
    refetchFactories: refetch,
  };
};
