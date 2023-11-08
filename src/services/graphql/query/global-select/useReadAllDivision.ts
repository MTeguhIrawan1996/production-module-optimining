import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_DIVISION = gql`
  query ReadAllDivision(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
  ) {
    employeeDivisions(
      findAllEmployeeDivisionInput: {
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

export interface IDivisionData {
  id: string;
  name: string;
}

interface IEmployeeDivisionsResponse {
  employeeDivisions: GResponse<IDivisionData>;
}

export const useReadAllDivision = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: Partial<IGlobalMetaRequest>;
  onCompleted?: (data: IEmployeeDivisionsResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: employeeDivisionsData,
    loading: employeeDivisionsDataLoading,
    refetch,
  } = useQuery<IEmployeeDivisionsResponse, Partial<IGlobalMetaRequest>>(
    READ_ALL_DIVISION,
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
    employeeDivisionsData: employeeDivisionsData?.employeeDivisions.data,
    employeeDivisionsDataMeta: employeeDivisionsData?.employeeDivisions.meta,
    employeeDivisionsDataLoading,
    refetchemployeeDivisionsData: refetch,
  };
};
