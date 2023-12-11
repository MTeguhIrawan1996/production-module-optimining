import { ApolloError, gql, useQuery } from '@apollo/client';

import {
  GResponse,
  IDumpTruckRitagesData,
  IDumpTruckRitagesRequest,
} from '@/types/global';

export const READ_ALL_RITAGE_OB_DT = gql`
  query ReadAllRitageObDT(
    $page: Int
    $limit: Int
    $date: String
    $orderBy: String
    $orderDir: String
  ) {
    overburdenDumpTruckRitages(
      findAllOverburdenDumpTruckRitageInput: {
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

interface IOverburdenDumpTruckRitagesResponse {
  overburdenDumpTruckRitages: GResponse<IDumpTruckRitagesData>;
}

export const useReadAllRitageObDT = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: IDumpTruckRitagesRequest;
  onCompleted?: (data: IOverburdenDumpTruckRitagesResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: overburdenDumpTruckRitagesData,
    loading: overburdenDumpTruckRitagesDataLoading,
    refetch,
  } = useQuery<IOverburdenDumpTruckRitagesResponse, IDumpTruckRitagesRequest>(
    READ_ALL_RITAGE_OB_DT,
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
    overburdenDumpTruckRitagesData:
      overburdenDumpTruckRitagesData?.overburdenDumpTruckRitages.data,
    overburdenDumpTruckRitagesDataMeta:
      overburdenDumpTruckRitagesData?.overburdenDumpTruckRitages.meta,
    overburdenDumpTruckRitagesDataLoading,
    refetchOverburdenDumpTruckRitages: refetch,
  };
};
