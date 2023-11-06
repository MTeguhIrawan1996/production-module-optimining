import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_HEAVY_EQUIPMENT_MODEL = gql`
  query ReadAllHeavyEquipmentModel(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
    $brandId: String
    $typeId: String
  ) {
    heavyEquipmentModels(
      findAllHeavyEquipmentModelInput: {
        page: $page
        limit: $limit
        search: $search
        orderBy: $orderBy
        orderDir: $orderDir
        brandId: $brandId
        typeId: $typeId
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

export interface IHeavyEquipmentModelData {
  id: string;
  name: string;
  slug: string;
}

interface IHeavyEquipmentModelResponse {
  heavyEquipmentModels: GResponse<IHeavyEquipmentModelData>;
}

interface IHeavyEquipmentModelRequest extends Partial<IGlobalMetaRequest> {
  brandId?: string | null;
  typeId?: string | null;
}

export const useReadAllHeavyEquipmentModel = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: IHeavyEquipmentModelRequest;
  onCompleted?: (data: IHeavyEquipmentModelResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: modelsData,
    loading: modelsDataLoading,
    refetch,
  } = useQuery<IHeavyEquipmentModelResponse, IHeavyEquipmentModelRequest>(
    READ_ALL_HEAVY_EQUIPMENT_MODEL,
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
    modelsData: modelsData?.heavyEquipmentModels.data,
    modelsDataMeta: modelsData?.heavyEquipmentModels.meta,
    modelsDataLoading,
    refetchModelsData: refetch,
  };
};
