import { ApolloError, gql, useQuery } from '@apollo/client';

import {
  GResponse,
  IDumpTruckRitagesData,
  IDumpTruckRitagesRequest,
} from '@/types/global';

export const READ_ALL_RITAGE_BARGING_DT = gql`
  query ReadAllRitageBargingDT(
    $page: Int
    $limit: Int
    $date: String
    $orderBy: String
    $orderDir: String
  ) {
    bargingDumpTruckRitages(
      findAllBargingDumpTruckRitageInput: {
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

interface IBargingDumpTruckRitagesResponse {
  bargingDumpTruckRitages: GResponse<IDumpTruckRitagesData>;
}

export const useReadAllRitageBargingDT = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: IDumpTruckRitagesRequest;
  onCompleted?: (data: IBargingDumpTruckRitagesResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: bargingDumpTruckRitagesData,
    loading: bargingDumpTruckRitagesDataLoading,
    refetch,
  } = useQuery<IBargingDumpTruckRitagesResponse, IDumpTruckRitagesRequest>(
    READ_ALL_RITAGE_BARGING_DT,
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
    bargingDumpTruckRitagesData:
      bargingDumpTruckRitagesData?.bargingDumpTruckRitages.data,
    bargingDumpTruckRitagesDataMeta:
      bargingDumpTruckRitagesData?.bargingDumpTruckRitages.meta,
    bargingDumpTruckRitagesDataLoading,
    refetchBargingDumpTruckRitages: refetch,
  };
};
