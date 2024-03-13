import {
  ApolloError,
  gql,
  useQuery,
  WatchQueryFetchPolicy,
} from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_MASTER_DATA_COMPANY = gql`
  query ReadAllCompanies(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
    $typeId: String
    $businessTypeId: String
  ) {
    companies(
      findAllCompanyInput: {
        page: $page
        limit: $limit
        search: $search
        orderBy: $orderBy
        orderDir: $orderDir
        typeId: $typeId
        businessTypeId: $businessTypeId
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
        alias
        code
        presidentDirector {
          id
          humanResource {
            id
            name
          }
        }
        type {
          id
          name
        }
      }
    }
  }
`;

type IHumanResource = {
  id: string;
  humanResource: {
    id: string;
    name: string;
  } | null;
};

interface ICompaniesData {
  id: string;
  name: string;
  alias: string | null;
  code: string | null;
  presidentDirector: IHumanResource | null;
  type: {
    id: string;
    name: string | null;
  } | null;
}

interface ICompaniesResponse {
  companies: GResponse<ICompaniesData>;
}

interface ICompaniesRequest extends Partial<IGlobalMetaRequest> {
  typeId?: string | null;
  businessTypeId?: string | null;
}

export const useReadAllCompaniesMasterData = ({
  variables,
  onCompleted,
  skip,
  fetchPolicy = 'cache-first',
}: {
  variables?: ICompaniesRequest;
  onCompleted?: (data: ICompaniesResponse) => void;
  skip?: boolean;
  fetchPolicy?: WatchQueryFetchPolicy;
}) => {
  const {
    data: companiesData,
    loading: companiesDataLoading,
    refetch,
  } = useQuery<ICompaniesResponse, ICompaniesRequest>(
    READ_ALL_MASTER_DATA_COMPANY,
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
    companiesData: companiesData?.companies.data,
    companiesDataMeta: companiesData?.companies.meta,
    companiesDataLoading,
    refetchCompanies: refetch,
  };
};
