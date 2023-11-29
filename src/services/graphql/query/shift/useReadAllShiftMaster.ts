import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_SHIFT_MASTER = gql`
  query ReadAllShift(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
  ) {
    shifts(
      findAllShiftInput: {
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
        startHour
        endHour
      }
    }
  }
`;

export interface IShiftsData {
  id: string;
  name: string;
  startHour: string;
  endHour: string;
}

interface IShiftsResponse {
  shifts: GResponse<IShiftsData>;
}

export const useReadAllShiftMaster = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: Partial<IGlobalMetaRequest>;
  onCompleted?: (data: IShiftsResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: shiftsData,
    loading: shiftsDataLoading,
    refetch,
  } = useQuery<IShiftsResponse, Partial<IGlobalMetaRequest>>(
    READ_ALL_SHIFT_MASTER,
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
    shiftsData: shiftsData?.shifts.data,
    shiftsDataMeta: shiftsData?.shifts.meta,
    shiftsDataLoading,
    refetchShifts: refetch,
  };
};
