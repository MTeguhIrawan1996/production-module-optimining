import { ApolloError, gql, useMutation } from '@apollo/client';

export const UPDATE_HEAVY_EQUIPMENT_CALSS = gql`
  mutation UpdateHeavyEquipmentClass(
    $id: String!
    $name: String!
    $heavyEquipmentReferenceIds: [String!]!
  ) {
    updateHeavyEquipmentClass(
      updateHeavyEquipmentClassInput: {
        id: $id
        name: $name
        heavyEquipmentReferenceIds: $heavyEquipmentReferenceIds
      }
    ) {
      id
    }
  }
`;

export interface IUpdateHeavyEquipmentClassRequest {
  id: string;
  name: string;
  heavyEquipmentReferenceIds: string[];
}

interface IUpdateHeavyEquipmentClassResponse {
  updateHeavyEquipmentClass: {
    id: string;
  };
}

export const useUpdateHeavyEquipmentClass = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateHeavyEquipmentClassResponse) => void;
}) => {
  return useMutation<
    IUpdateHeavyEquipmentClassResponse,
    IUpdateHeavyEquipmentClassRequest
  >(UPDATE_HEAVY_EQUIPMENT_CALSS, {
    onError,
    onCompleted,
  });
};
