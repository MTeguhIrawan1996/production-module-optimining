import { ApolloError, gql, useMutation } from '@apollo/client';

export const DELETE_HEAVY_EQUIPMENT_PRODUCTION = gql`
  mutation DeleteHeavyEquipmentProduction($id: String!) {
    deleteHeavyEquipmentData(id: $id)
  }
`;

export interface IDeleteHeavyEquipmentProductionRequest {
  id: string;
}

interface IDeleteHeavyEquipmentProductionResponse {
  deleteHeavyEquipmentData: boolean;
}

export const useDeleteHeavyEquipmentProduction = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IDeleteHeavyEquipmentProductionResponse) => void;
}) => {
  return useMutation<
    IDeleteHeavyEquipmentProductionResponse,
    IDeleteHeavyEquipmentProductionRequest
  >(DELETE_HEAVY_EQUIPMENT_PRODUCTION, {
    onError,
    onCompleted,
  });
};
