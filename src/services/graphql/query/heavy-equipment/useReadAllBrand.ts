import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_BRAND = gql`
  query ReadAllBrand(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
  ) {
    heavyEquipmentBrands(
      findAllHeavyEquipmentBrandInput: {
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
        slug
      }
    }
  }
`;

export interface IBrandData {
  id: string;
  name: string;
  slug: string;
}

interface IBrandResponse {
  heavyEquipmentBrands: GResponse<IBrandData>;
}

export const useReadAllBrand = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: Partial<IGlobalMetaRequest>;
  onCompleted?: (data: IBrandResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: brandData,
    loading: brandsDataLoading,
    refetch,
  } = useQuery<IBrandResponse, Partial<IGlobalMetaRequest>>(READ_ALL_BRAND, {
    variables: variables,
    skip: skip,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted,
    fetchPolicy: 'cache-first',
  });

  return {
    brandsData: brandData?.heavyEquipmentBrands.data,
    brandsDataMeta: brandData?.heavyEquipmentBrands.meta,
    brandsDataLoading,
    refetchBrandsData: refetch,
  };
};
