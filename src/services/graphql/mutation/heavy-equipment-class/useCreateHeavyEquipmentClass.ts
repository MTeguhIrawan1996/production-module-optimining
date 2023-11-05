import { ApolloError, gql, useMutation } from '@apollo/client';

export const CREATE_HEAVY_EQUIPMENT_CALSS = gql`
  mutation CreateHeavyEquipmentClass(
    $name: String!
    $heavyEquipmentTypeIds: [String!]!
  ) {
    createHeavyEquipmentClass(
      createHeavyEquipmentClassInput: {
        name: $name
        heavyEquipmentTypeIds: $heavyEquipmentTypeIds
      }
    ) {
      id
    }
  }
`;

export interface ICreateHeavyEquipmentClassRequest {
  name: string;
  heavyEquipmentTypeIds: string[];
}

interface ICreateHeavyEquipmentClassResponse {
  createHeavyEquipmentClass: {
    id: string;
  };
}

export const useCreateHeavyEquipmentClass = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: ICreateHeavyEquipmentClassResponse) => void;
}) => {
  return useMutation<
    ICreateHeavyEquipmentClassResponse,
    ICreateHeavyEquipmentClassRequest
  >(CREATE_HEAVY_EQUIPMENT_CALSS, {
    onError,
    onCompleted,
  });
};
