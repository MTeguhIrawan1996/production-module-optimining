import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_POSITION = gql`
  query ReadAllEmployePosition(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
  ) {
    employeePositions(
      findAllEmployeePositionInput: {
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

export interface IPositionData {
  id: string;
  name: string;
}

interface IEmployeePositionsResponse {
  employeePositions: GResponse<IPositionData>;
}

export const useReadAllEmployePosition = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: Partial<IGlobalMetaRequest>;
  onCompleted?: (data: IEmployeePositionsResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: employeePositionsData,
    loading: employeePositionsDataLoading,
    refetch,
  } = useQuery<IEmployeePositionsResponse, Partial<IGlobalMetaRequest>>(
    READ_ALL_POSITION,
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
    employeePositionsData: employeePositionsData?.employeePositions.data,
    employeePositionsDataMeta: employeePositionsData?.employeePositions.meta,
    employeePositionsDataLoading,
    refetchemployeePositionsData: refetch,
  };
};
