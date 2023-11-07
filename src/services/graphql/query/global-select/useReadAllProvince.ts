import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_PROVINCE = gql`
  query ReadAllProvince(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
  ) {
    provinces(
      findAllProvinceInput: {
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

export interface IProvinceData {
  id: string;
  name: string;
}

interface IProvincesResponse {
  provinces: GResponse<IProvinceData>;
}

export const useReadAllProvince = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: Partial<IGlobalMetaRequest>;
  onCompleted?: (data: IProvincesResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: provincesData,
    loading: provincesDataLoading,
    refetch,
  } = useQuery<IProvincesResponse, Partial<IGlobalMetaRequest>>(
    READ_ALL_PROVINCE,
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
    provincesData: provincesData?.provinces.data,
    provincesDataMeta: provincesData?.provinces.meta,
    provincesDataLoading,
    refetchprovincesData: refetch,
  };
};
