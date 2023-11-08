import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_EMPLOYE_STATUS = gql`
  query ReadAllEmployeStatus(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
  ) {
    employeeStatuses(
      findAllEmployeeStatusInput: {
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

export interface IEmployeStatusesData {
  id: string;
  name: string;
}

interface IEmployeeStatusesResponse {
  employeeStatuses: GResponse<IEmployeStatusesData>;
}

export const useReadAllEmployeStatus = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: Partial<IGlobalMetaRequest>;
  onCompleted?: (data: IEmployeeStatusesResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: employeeStatusesData,
    loading: employeeStatusesDataLoading,
    refetch,
  } = useQuery<IEmployeeStatusesResponse, Partial<IGlobalMetaRequest>>(
    READ_ALL_EMPLOYE_STATUS,
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
    employeeStatusesData: employeeStatusesData?.employeeStatuses.data,
    employeeStatusesDataMeta: employeeStatusesData?.employeeStatuses.meta,
    employeeStatusesDataLoading,
    refetchemployeeStatusesData: refetch,
  };
};
