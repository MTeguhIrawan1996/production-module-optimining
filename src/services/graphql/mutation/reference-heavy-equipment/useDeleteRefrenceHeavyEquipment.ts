import { ApolloError, gql, useMutation } from '@apollo/client';

export const DELETE_REFRENCE_HEAVY_EQUIPMENT = gql`
  mutation DeleteHeavyEquipmentReference($id: String!) {
    deleteHeavyEquipmentReference(id: $id)
  }
`;

export interface IDeleteReferenceHERequest {
  id: string;
}

interface IDeleteReferenceHEResponse {
  deleteHeavyEquipmentReference: boolean;
}

export const useDeleteHeavyEquipmentReference = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IDeleteReferenceHEResponse) => void;
}) => {
  return useMutation<IDeleteReferenceHEResponse, IDeleteReferenceHERequest>(
    DELETE_REFRENCE_HEAVY_EQUIPMENT,
    {
      onError,
      onCompleted,
    }
  );
};
