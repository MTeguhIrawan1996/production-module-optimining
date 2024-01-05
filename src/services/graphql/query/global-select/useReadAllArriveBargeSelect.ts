import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_ARRIVE_BARGE_SELECT = gql`
  query ReadAllArriveBargeSelect(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
  ) {
    monitoringBargingDestinationTypes(
      findAllMonitoringBargingDestinationTypeInput: {
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

export interface IReadAllArriveBargeSelectData {
  id: string;
  name: string;
}

interface IReadAllArriveBargeSelectResponse {
  monitoringBargingDestinationTypes: GResponse<IReadAllArriveBargeSelectData>;
}

export const useReadAllArriveBargeSelect = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: Partial<IGlobalMetaRequest>;
  onCompleted?: (data: IReadAllArriveBargeSelectResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: arriveBargeData,
    loading: arriveBargeDataLoading,
    refetch,
  } = useQuery<IReadAllArriveBargeSelectResponse, Partial<IGlobalMetaRequest>>(
    READ_ALL_ARRIVE_BARGE_SELECT,
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
    arriveBargeData: arriveBargeData?.monitoringBargingDestinationTypes.data,
    arriveBargeDataMeta:
      arriveBargeData?.monitoringBargingDestinationTypes.meta,
    arriveBargeDataLoading,
    refetcharriveBargeData: refetch,
  };
};
