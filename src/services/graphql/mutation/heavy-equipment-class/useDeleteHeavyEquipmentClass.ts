import { ApolloError, gql, useMutation } from '@apollo/client';

export const DELETE_HEAVY_EQUIPMENT_CLASS = gql`
  mutation DeleteHeavyEquipmentClass($id: String!) {
    deleteHeavyEquipmentClass(id: $id)
  }
`;

export interface IDeleteHEClassRequest {
  id: string;
}

interface IDeleteHEClassResponse {
  deleteHeavyEquipmentClass: boolean;
}

export const useDeleteHeavyEquipmentClass = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IDeleteHEClassResponse) => void;
}) => {
  return useMutation<IDeleteHEClassResponse, IDeleteHEClassRequest>(
    DELETE_HEAVY_EQUIPMENT_CLASS,
    {
      onError,
      onCompleted,
    }
  );
};
