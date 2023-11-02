import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_HEAVY_EQUIPMENT = gql`
  query ReadAllHeavyEquipment(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
    $modelId: String
    $typeId: String
    $brandId: String
  ) {
    heavyEquipmentReferences(
      findAllHeavyEquipmentReferenceInput: {
        page: $page
        limit: $limit
        search: $search
        orderBy: $orderBy
        orderDir: $orderDir
        modelId: $modelId
        typeId: $typeId
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
        model {
          id
          name

          type {
            id
            name
            brand {
              name
            }
          }
        }
        spec
        createdYear
      }
    }
  }
`;

export interface IHeavyEquipmentData {
  id: string;
  model: {
    id: string;
    name: string;
    type: {
      id: string;
      name: string;
      brand: {
        name: string;
      };
    };
  } | null;
  spec: string | null;
  createdYear: string;
}

interface IHeavyEquipmentResponse {
  heavyEquipmentReferences: GResponse<IHeavyEquipmentData>;
}

interface IHeavyEquipmentRequest extends Partial<IGlobalMetaRequest> {
  modelId?: string | null;
  typeId?: string | null;
  brandId?: string | null;
}

export const useReadAllHeavyEquipment = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: IHeavyEquipmentRequest;
  onCompleted?: (data: IHeavyEquipmentResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: heavyEquipmentData,
    loading: heavyEquipmentDataLoading,
    refetch,
  } = useQuery<IHeavyEquipmentResponse, IHeavyEquipmentRequest>(
    READ_ALL_HEAVY_EQUIPMENT,
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
    heavyEquipmentsData: heavyEquipmentData?.heavyEquipmentReferences.data,
    heavyEquipmentsDataMeta: heavyEquipmentData?.heavyEquipmentReferences.meta,
    heavyEquipmentDataLoading,
    refetchHeavyEquipments: refetch,
  };
};
