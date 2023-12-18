import { ApolloError, gql, useQuery } from '@apollo/client';

import {
  GResponse,
  IDumpTruckRitagesData,
  IDumpTruckRitagesRequest,
} from '@/types/global';

export const READ_ALL_RITAGE_TOPSOIL_DT = gql`
  query ReadAllRitageTopsoilDT(
    $page: Int
    $limit: Int
    $date: String
    $orderBy: String
    $orderDir: String
  ) {
    topsoilDumpTruckRitages(
      findAllTopsoilDumpTruckRitageInput: {
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
        ritageCount
        tonByRitage
      }
    }
  }
`;

interface ITopsoilDumpTruckRitagesResponse {
  topsoilDumpTruckRitages: GResponse<IDumpTruckRitagesData>;
}

export const useReadAllRitageTopsoilDT = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: IDumpTruckRitagesRequest;
  onCompleted?: (data: ITopsoilDumpTruckRitagesResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: topsoilDumpTruckRitagesData,
    loading: topsoilDumpTruckRitagesDataLoading,
    refetch,
  } = useQuery<ITopsoilDumpTruckRitagesResponse, IDumpTruckRitagesRequest>(
    READ_ALL_RITAGE_TOPSOIL_DT,
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
    topsoilDumpTruckRitagesData:
      topsoilDumpTruckRitagesData?.topsoilDumpTruckRitages.data,
    topsoilDumpTruckRitagesDataMeta:
      topsoilDumpTruckRitagesData?.topsoilDumpTruckRitages.meta,
    topsoilDumpTruckRitagesDataLoading,
    refetchTopsoilDumpTruckRitages: refetch,
  };
};
