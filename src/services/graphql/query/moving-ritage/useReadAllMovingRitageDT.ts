import { ApolloError, gql, useQuery } from '@apollo/client';

import {
  GResponse,
  IDumpTruckRitagesData,
  IDumpTruckRitagesRequest,
} from '@/types/global';

export const READ_ALL_RITAGE_MOVING_DT = gql`
  query ReadAllRitageMovingDT(
    $page: Int
    $limit: Int
    $date: String
    $orderBy: String
    $orderDir: String
  ) {
    movingDumpTruckRitages(
      findAllMovingDumpTruckRitageInput: {
        page: $page
        limit: $limit
        date: $date
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
        date
        companyHeavyEquipment {
          id
          hullNumber
        }
        shift {
          id
          name
        }
        operators
        ritageCount
        tonByRitage
      }
    }
  }
`;

interface IReadAllRitageMovingDTResponse {
  movingDumpTruckRitages: GResponse<IDumpTruckRitagesData>;
}

export const useReadAllRitageMovingDT = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: IDumpTruckRitagesRequest;
  onCompleted?: (data: IReadAllRitageMovingDTResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: movingDumpTruckRitagesData,
    loading: movingDumpTruckRitagesDataLoading,
    refetch,
  } = useQuery<IReadAllRitageMovingDTResponse, IDumpTruckRitagesRequest>(
    READ_ALL_RITAGE_MOVING_DT,
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
    movingDumpTruckRitagesData:
      movingDumpTruckRitagesData?.movingDumpTruckRitages.data,
    movingDumpTruckRitagesDataMeta:
      movingDumpTruckRitagesData?.movingDumpTruckRitages.meta,
    movingDumpTruckRitagesDataLoading,
    refetchmovingDumpTruckRitages: refetch,
  };
};
