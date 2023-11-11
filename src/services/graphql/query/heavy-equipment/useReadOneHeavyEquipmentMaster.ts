import { ApolloError, gql, useQuery } from '@apollo/client';

import { IFile } from '@/types/global';

export const READ_ONE_HEAVY_EQUIPMENT_MASTER = gql`
  query ReadOneHeavyEquipmentMaster($id: String!) {
    heavyEquipment(id: $id) {
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
      class {
        id
        name
      }
      eligibilityStatus {
        id
        name
      }
      vehicleNumber
      vehicleNumberPhoto {
        id
        fileName
        url
        originalFileName
      }
      photos {
        id
        fileName
        url
        originalFileName
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
      } | null;
    } | null;
  };
  specification: string | null;
  createdYear: string;
  class: {
    id: string;
    name: string;
  } | null;
  eligibilityStatus: {
    id: string;
    name: string;
  } | null;
  vehicleNumber: string;
  vehicleNumberPhoto: Omit<IFile, 'mime' | 'path'> | null;
  photos: Omit<IFile, 'mime' | 'path'>[] | null;
}

export interface IHeavyEquipmentMasterResponse {
  heavyEquipment: IHeavyEquipmentMasterData;
}

export interface IHeavyEquipmentMasterRequest {
  id: string;
}

export const useReadOneHeavyEquipmentMaster = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: IHeavyEquipmentMasterRequest;
  skip?: boolean;
  onCompleted?: (data: IHeavyEquipmentMasterResponse) => void;
}) => {
  const {
    data: heavyEquipmentMasterData,
    loading: heavyEquipmentMasterDataLoading,
  } = useQuery<IHeavyEquipmentMasterResponse, IHeavyEquipmentMasterRequest>(
    READ_ONE_HEAVY_EQUIPMENT_MASTER,
    {
      variables,
      onError: (err: ApolloError) => {
        return err;
      },
      onCompleted: onCompleted,
      skip,
      fetchPolicy: 'cache-and-network',
    }
  );

  return {
    heavyEquipmentMasterData: heavyEquipmentMasterData?.heavyEquipment,
    heavyEquipmentMasterDataLoading,
  };
};
