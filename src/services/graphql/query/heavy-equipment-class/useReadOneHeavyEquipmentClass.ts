import { ApolloError, gql, useQuery } from '@apollo/client';

export const READ_ONE_HEAVY_EQUIPMENT_CLASS = gql`
  query ReadHeavyEquipmentClass($id: String!) {
    heavyEquipmentClass(id: $id) {
      id
      name
      heavyEquipmentTypes {
        id
        name
      }
    }
  }
`;

export interface IHeavyEquipmentClassType {
  id: string;
  name: string;
}

export interface IHeavyEquipmentClassData {
  id: string;
  name: string;
  heavyEquipmentTypes: IHeavyEquipmentClassType[];
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
