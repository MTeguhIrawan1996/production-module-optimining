import { ApolloError, gql, useMutation } from '@apollo/client';

export const CREATE_HEAVY_EQUIPMENT_CALSS = gql`
  mutation CreateHeavyEquipmentClass(
    $name: String!
    $heavyEquipmentReferenceIds: [String!]!
  ) {
    createHeavyEquipmentClass(
      createHeavyEquipmentClassInput: {
        name: $name
        heavyEquipmentReferenceIds: $heavyEquipmentReferenceIds
      }
    ) {
      id
    }
  }
`;

export interface ICreateHeavyEquipmentClassRequest {
  name: string;
  heavyEquipmentReferenceIds: string[];
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
