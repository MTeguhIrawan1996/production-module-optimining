import { ApolloError, gql, useMutation } from '@apollo/client';

export const DELETE_MASTER_HEAVY_EQUIPMENT = gql`
  mutation DeleteMasterHeavyEquipment($id: String!) {
    deleteHeavyEquipment(id: $id)
  }
`;

interface IDeleteMasterHERequest {
  id: string;
}

interface IDeleteMasterHEResponse {
  deleteHeavyEquipment: boolean;
}

export const useDeleteMasterHeavyEquipment = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IDeleteMasterHEResponse) => void;
}) => {
  return useMutation<IDeleteMasterHEResponse, IDeleteMasterHERequest>(
    DELETE_MASTER_HEAVY_EQUIPMENT,
    {
      onError,
      onCompleted,
    }
  );
};
