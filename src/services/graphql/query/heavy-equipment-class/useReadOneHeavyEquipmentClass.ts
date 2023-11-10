import { ApolloError, gql, useQuery } from '@apollo/client';

export const READ_ONE_HEAVY_EQUIPMENT_CLASS = gql`
  query ReadOneHeavyEquipmentClass($id: String!) {
    heavyEquipmentClass(id: $id) {
      id
      name
      heavyEquipmentReferences {
        id
        modelName
        type {
          name
          brand {
            name
          }
        }
      }
    }
  }
`;

export interface IHeavyEquipmentClassModel {
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
}

export interface IHeavyEquipmentClassData {
  id: string;
  name: string;
  heavyEquipmentReferences: IHeavyEquipmentClassModel[];
}

export interface IHeavyEquipmentClassResponse {
  heavyEquipmentClass: IHeavyEquipmentClassData;
}

export interface IHeavyEquipmentClassRequest {
  id: string;
}

export const useReadOneHeavyEquipmentClass = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: IHeavyEquipmentClassRequest;
  skip?: boolean;
  onCompleted?: (data: IHeavyEquipmentClassResponse) => void;
}) => {
  const {
    data: heavyEquipmentClassData,
    loading: heavyEquipmentClassDataLoading,
  } = useQuery<IHeavyEquipmentClassResponse, IHeavyEquipmentClassRequest>(
    READ_ONE_HEAVY_EQUIPMENT_CLASS,
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
    heavyEquipmentClassData: heavyEquipmentClassData?.heavyEquipmentClass,
    heavyEquipmentClassDataLoading,
  };
};
