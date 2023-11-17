import { ApolloError, gql, useMutation } from '@apollo/client';

export const DELETE_MATERIAL_MASTER = gql`
  mutation DeleteMaterialMaster($id: String!) {
    deleteMaterial(id: $id)
  }
`;

export interface IDeleteMaterialMasterRequest {
  id: string;
}

interface IDeleteMaterialMasterResponse {
  deleteMaterial: boolean;
}

export const useDeleteMaterialMaster = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IDeleteMaterialMasterResponse) => void;
}) => {
  return useMutation<
    IDeleteMaterialMasterResponse,
    IDeleteMaterialMasterRequest
  >(DELETE_MATERIAL_MASTER, {
    onError,
    onCompleted,
  });
};
