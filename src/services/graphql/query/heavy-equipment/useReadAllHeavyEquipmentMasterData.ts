import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_HEAVY_EQUIPMENT_MASTER_DATA = gql`
  query ReadAllHeavyEquipmentMasterData(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
    $typeId: String
    $brandId: String
    $referenceId: String
    $classId: String
  ) {
    heavyEquipments(
      findAllHeavyEquipmentInput: {
        page: $page
        limit: $limit
        search: $search
        orderBy: $orderBy
        orderDir: $orderDir
        typeId: $typeId
        brandId: $brandId
        referenceId: $referenceId
        classId: $classId
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
        engineNumber
        chassisNumber
        reference {
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
        }
        specification
        createdYear
      }
    }
  }
`;

export interface IHeavyEquipmentMasterData {
  id: string;
  engineNumber: string;
  chassisNumber: string;
  reference: {
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
  };
  specification: string | null;
  createdYear: string | null;
}

interface IHeavyEquipmentMasterDataResponse {
  heavyEquipments: GResponse<IHeavyEquipmentMasterData>;
}

interface IHeavyEquipmentMasterDataRequest extends Partial<IGlobalMetaRequest> {
  typeId?: string | null;
  brandId?: string | null;
  referenceId?: string | null;
  classId?: string | null;
}

export const useReadAllHeavyEquipmentMasterData = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: IHeavyEquipmentMasterDataRequest;
  onCompleted?: (data: IHeavyEquipmentMasterDataResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: heavyEquipmentMasterData,
    loading: heavyEquipmentMasterDataLoading,
    refetch,
  } = useQuery<
    IHeavyEquipmentMasterDataResponse,
    IHeavyEquipmentMasterDataRequest
  >(READ_ALL_HEAVY_EQUIPMENT_MASTER_DATA, {
    variables: variables,
    skip: skip,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted,
    fetchPolicy: 'cache-and-network',
  });

  return {
    heavyEquipmentsMasterData: heavyEquipmentMasterData?.heavyEquipments.data,
    heavyEquipmentsMasterDataMeta:
      heavyEquipmentMasterData?.heavyEquipments.meta,
    heavyEquipmentMasterDataLoading,
    refetchHeavyEquipmentMasterData: refetch,
  };
};
