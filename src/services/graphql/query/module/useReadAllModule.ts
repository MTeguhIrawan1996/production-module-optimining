import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_MODULE = gql`
  query ReadAllModule(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
  ) {
    modules(
      findAllModuleInput: {
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
        permissions {
          data {
            id
            action {
              id
              name
              slug
            }
          }
        }
      }
    }
  }
`;

export interface IModuleData {
  id: string;
  name: string;
  slug: string;
  permissions: {
    data: {
      id: string;
      action: {
        id: string;
        name: string;
        slug: string;
      };
    }[];
  };
}

interface IModuleResponse {
  modules: GResponse<IModuleData>;
}

export const useReadAllModule = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: Partial<IGlobalMetaRequest>;
  onCompleted?: (data: IModuleResponse) => void;
  skip?: boolean;
}) => {
  const { data: moduleData, loading: moduleLoading } = useQuery<
    IModuleResponse,
    Partial<IGlobalMetaRequest>
  >(READ_ALL_MODULE, {
    variables: variables,
    skip: skip,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted,
    fetchPolicy: 'cache-and-network',
  });

  return {
    moduleData: moduleData?.modules.data,
    moduleMeta: moduleData?.modules.meta,
    moduleLoading,
  };
};
