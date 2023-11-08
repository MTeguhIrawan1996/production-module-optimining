import { ApolloError, gql, useQuery } from '@apollo/client';

import { IEmployeesResponse } from '@/services/graphql/query/master-data-company/useReadAllEmploye';

export const READ_ONE_COMPANY = gql`
  query ReadOneCompany(
    $id: String!
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
    $positionId: String
    $divisionId: String
    $statusId: String
    $isComplete: Boolean
  ) {
    company(id: $id) {
      id
      name
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
        }
      ) {
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
  }
`;

export interface ICompanyData extends IEmployeesResponse {
  id: string;
  name: string;
}

export interface ICompanyResponse {
  company: ICompanyData;
}

export interface ICompanyRequest {
  id: string;
}

export const useReadOneCompany = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: ICompanyRequest;
  skip?: boolean;
  onCompleted?: (data: ICompanyResponse) => void;
}) => {
  const { data: companyData, loading: companyDataLoading } = useQuery<
    ICompanyResponse,
    ICompanyRequest
  >(READ_ONE_COMPANY, {
    variables,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted: onCompleted,
    skip,
    fetchPolicy: 'cache-and-network',
  });

  return {
    companyData: companyData?.company,
    companyDataLoading,
  };
};
