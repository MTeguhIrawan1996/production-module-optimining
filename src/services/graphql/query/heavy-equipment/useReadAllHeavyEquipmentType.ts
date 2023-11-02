import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_HEAVY_EQUIPMENT_TYPE = gql`
  query ReadAllHeavyEquipmentType(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
    $brandId: String
  ) {
    heavyEquipmentTypes(
      findAllHeavyEquipmentTypeInput: {
        page: $page
        limit: $limit
        search: $search
        orderBy: $orderBy
        orderDir: $orderDir
        brandId: $brandId
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

export interface IHeavyEquipmentTypeData {
  id: string;
  name: string;
  slug: string;
}

interface IHeavyEquipmentTypesResponse {
  heavyEquipmentTypes: GResponse<IHeavyEquipmentTypeData>;
}

interface IHeavyEquipmentTypesRequest extends Partial<IGlobalMetaRequest> {
  brandId?: string | null;
}

export const useReadAllHeavyEquipmentType = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: IHeavyEquipmentTypesRequest;
  onCompleted?: (data: IHeavyEquipmentTypesResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: typesData,
    loading: typesDataLoading,
    refetch,
  } = useQuery<IHeavyEquipmentTypesResponse, IHeavyEquipmentTypesRequest>(
    READ_ALL_HEAVY_EQUIPMENT_TYPE,
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
    typesData: typesData?.heavyEquipmentTypes.data,
    typesDataMeta: typesData?.heavyEquipmentTypes.meta,
    typesDataLoading,
    refetchTypesData: refetch,
  };
};
