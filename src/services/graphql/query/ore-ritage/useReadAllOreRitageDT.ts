import { ApolloError, gql, useQuery } from '@apollo/client';

import {
  GResponse,
  IDumpTruckRitagesData,
  IDumpTruckRitagesRequest,
} from '@/types/global';

export const READ_ALL_RITAGE_ORE_DT = gql`
  query ReadAllRitageOreDT(
    $page: Int
    $limit: Int
    $date: String
    $orderBy: String
    $orderDir: String
  ) {
    oreDumpTruckRitages(
      findAllOreDumpTruckRitageInput: {
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

interface IOreDumpTruckRitagesResponse {
  oreDumpTruckRitages: GResponse<IDumpTruckRitagesData>;
}

export const useReadAllRitageOreDT = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: IDumpTruckRitagesRequest;
  onCompleted?: (data: IOreDumpTruckRitagesResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: oreDumpTruckRitagesData,
    loading: oreDumpTruckRitagesDataLoading,
    refetch,
  } = useQuery<IOreDumpTruckRitagesResponse, IDumpTruckRitagesRequest>(
    READ_ALL_RITAGE_ORE_DT,
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
    oreDumpTruckRitagesData: oreDumpTruckRitagesData?.oreDumpTruckRitages.data,
    oreDumpTruckRitagesDataMeta:
      oreDumpTruckRitagesData?.oreDumpTruckRitages.meta,
    oreDumpTruckRitagesDataLoading,
    refetchOreDumpTruckRitages: refetch,
  };
};
