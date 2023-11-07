import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_SUB_VILLAGE = gql`
  query ReadAllVillage(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
    $provinceId: String
    $regencyId: String
    $districtId: String
  ) {
    villages(
      findAllVillageInput: {
        page: $page
        limit: $limit
        search: $search
        orderBy: $orderBy
        orderDir: $orderDir
        provinceId: $provinceId
        regencyId: $regencyId
        districtId: $districtId
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

export interface IVillageData {
  id: string;
  name: string;
}

interface IVillagesResponse {
  villages: GResponse<IVillageData>;
}

interface IVillageRequest extends IGlobalMetaRequest {
  provinceId: string | null;
  regencyId: string | null;
  districtId: string | null;
}

export const useReadAllVillage = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: Partial<IVillageRequest>;
  onCompleted?: (data: IVillagesResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: villagesData,
    loading: villagesDataLoading,
    refetch,
  } = useQuery<IVillagesResponse, Partial<IVillageRequest>>(
    READ_ALL_SUB_VILLAGE,
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
    villagesData: villagesData?.villages.data,
    villagesDataMeta: villagesData?.villages.meta,
    villagesDataLoading,
    refetchVillagesData: refetch,
  };
};
