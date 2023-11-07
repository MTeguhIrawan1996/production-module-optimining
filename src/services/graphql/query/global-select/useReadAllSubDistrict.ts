import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_SUB_DISTRICT = gql`
  query ReadAllSubDistrict(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
    $provinceId: String
    $regencyId: String
  ) {
    districts(
      findAllDistrictInput: {
        page: $page
        limit: $limit
        search: $search
        orderBy: $orderBy
        orderDir: $orderDir
        provinceId: $provinceId
        regencyId: $regencyId
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

export interface ISubDistrictData {
  id: string;
  name: string;
}

interface IDistrictsResponse {
  districts: GResponse<ISubDistrictData>;
}

interface ISubDistrictRequest extends IGlobalMetaRequest {
  provinceId: string | null;
  regencyId: string | null;
}

export const useReadAllSubDistrict = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: Partial<ISubDistrictRequest>;
  onCompleted?: (data: IDistrictsResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: districtsData,
    loading: districtsDataLoading,
    refetch,
  } = useQuery<IDistrictsResponse, Partial<ISubDistrictRequest>>(
    READ_ALL_SUB_DISTRICT,
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
    districtsData: districtsData?.districts.data,
    districtsDataMeta: districtsData?.districts.meta,
    districtsDataLoading,
    refetchDistrictsData: refetch,
  };
};
