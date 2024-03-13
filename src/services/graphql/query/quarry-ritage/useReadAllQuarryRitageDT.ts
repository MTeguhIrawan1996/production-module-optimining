import {
  ApolloError,
  gql,
  useQuery,
  WatchQueryFetchPolicy,
} from '@apollo/client';

import {
  GResponse,
  IDumpTruckRitagesData,
  IDumpTruckRitagesRequest,
} from '@/types/global';

export const READ_ALL_RITAGE_QUARRY_DT = gql`
  query ReadAllRitageQuarryDT(
    $page: Int
    $limit: Int
    $date: String
    $orderBy: String
    $orderDir: String
  ) {
    quarryDumpTruckRitages(
      findAllQuarryDumpTruckRitageInput: {
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

interface IQuarryDumpTruckRitagesResponse {
  quarryDumpTruckRitages: GResponse<IDumpTruckRitagesData>;
}

export const useReadAllRitageQuarryDT = ({
  variables,
  onCompleted,
  skip,
  fetchPolicy = 'cache-first',
}: {
  variables?: IDumpTruckRitagesRequest;
  onCompleted?: (data: IQuarryDumpTruckRitagesResponse) => void;
  skip?: boolean;
  fetchPolicy?: WatchQueryFetchPolicy;
}) => {
  const {
    data: quarryDumpTruckRitagesData,
    loading: quarryDumpTruckRitagesDataLoading,
    refetch,
  } = useQuery<IQuarryDumpTruckRitagesResponse, IDumpTruckRitagesRequest>(
    READ_ALL_RITAGE_QUARRY_DT,
    {
      variables: variables,
      skip: skip,
      onError: (err: ApolloError) => {
        return err;
      },
      onCompleted,
      fetchPolicy,
    }
  );

  return {
    quarryDumpTruckRitagesData:
      quarryDumpTruckRitagesData?.quarryDumpTruckRitages.data,
    quarryDumpTruckRitagesDataMeta:
      quarryDumpTruckRitagesData?.quarryDumpTruckRitages.meta,
    quarryDumpTruckRitagesDataLoading,
    refetchQuarryDumpTruckRitages: refetch,
  };
};
