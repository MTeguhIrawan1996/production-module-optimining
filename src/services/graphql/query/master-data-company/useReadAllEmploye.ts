import {
  ApolloError,
  gql,
  useQuery,
  WatchQueryFetchPolicy,
} from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_COMPANY_EMPLOYE = gql`
  query ReadAllEmployees(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
    $positionId: String
    $companyId: String
    $divisionId: String
    $statusId: String
    $isComplete: Boolean
  ) {
    employees(
      findAllEmployeeInput: {
        page: $page
        limit: $limit
        search: $search
        orderBy: $orderBy
        orderDir: $orderDir
        positionId: $positionId
        divisionId: $divisionId
        statusId: $statusId
        isComplete: $isComplete
        companyId: $companyId
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
        humanResource {
          id
          name
        }
        nip
        position {
          id
          name
        }
        division {
          id
          name
        }
        status {
          id
          name
        }
        isComplete
      }
    }
  }
`;

export interface IEmployeesData {
  id: string;
  humanResource: {
    id: string;
    name: string;
  } | null;
  nip: string;
  position: {
    id: string;
    name: string;
  } | null;
  division: {
    id: string;
    name: string;
  } | null;
  status: {
    id: string;
    name: string;
  };
  isComplete: boolean | null;
}

export interface IEmployeesResponse {
  employees: GResponse<IEmployeesData>;
}

interface IEmployeesRequest extends IGlobalMetaRequest {
  positionId: string | null;
  divisionId: string | null;
  statusId: string | null;
  isComplete: boolean | null;
  companyId: string | null;
}

export const useReadAllCompanyEmploye = ({
  variables,
  onCompleted,
  skip,
  fetchPolicy = 'cache-first',
}: {
  variables?: Partial<IEmployeesRequest>;
  onCompleted?: (data: IEmployeesResponse) => void;
  skip?: boolean;
  fetchPolicy?: WatchQueryFetchPolicy;
}) => {
  const {
    data: employeesData,
    loading: employeesDataLoading,
    refetch,
  } = useQuery<IEmployeesResponse, Partial<IEmployeesRequest>>(
    READ_ALL_COMPANY_EMPLOYE,
    {
      variables: variables,
      skip: skip,
      onError: (err: ApolloError) => {
        return err;
      },
      onCompleted,
      fetchPolicy,
      notifyOnNetworkStatusChange: true,
    }
  );

  return {
    employeesData: employeesData?.employees.data,
    employeesDataMeta: employeesData?.employees.meta,
    employeesDataLoading,
    refetchEmployees: refetch,
  };
};
