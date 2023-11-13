import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_HEAVY_EQUIPMENT = gql`
  query ReadAllHeavyEquipment(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
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
        modelName
        type {
          id
          name
          brand {
            id
            name
          }
        }

        spec
        modelYear
      }
    }
  }
`;

export interface IHeavyEquipmentData {
  id: string;
  modelName: string;
  type: {
    id: string;
    name: string;
    brand: {
      id: string;
      name: string;
    };
  };

  spec: string | null;
  modelYear: string;
}

interface IHeavyEquipmentResponse {
  heavyEquipmentReferences: GResponse<IHeavyEquipmentData>;
}

interface IHeavyEquipmentRequest extends Partial<IGlobalMetaRequest> {
  typeId?: string | null;
  brandId?: string | null;
}

export const useReadAllHeavyEquipmentRefrence = ({
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
