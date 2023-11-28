import { ApolloError, gql, useMutation } from '@apollo/client';

export const UPDATE_MATERIAL_MASTER = gql`
  mutation UpdateMaterialMaster(
    $id: String!
    $name: String!
    $subMaterials: [UpdateSubMaterialDto!]
  ) {
    updateMaterial(
      updateMaterialInput: { id: $id, name: $name, subMaterials: $subMaterials }
    ) {
      id
    }
  }
`;

export interface IMutationUpdateMaterialValues {
  name: string;
  subMaterials:
    | {
        subMaterialId: string | null;
        name: string;
      }[]
    | null;
}

type IUpdateMaterialMasterRequest = {
  id: string;
} & IMutationUpdateMaterialValues;

interface IUpdateMaterialMasterResponse {
  updateMaterial: {
    id: string;
  };
}

export const useUpdateMaterialMaster = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateMaterialMasterResponse) => void;
}) => {
  return useMutation<
    IUpdateMaterialMasterResponse,
    IUpdateMaterialMasterRequest
  >(UPDATE_MATERIAL_MASTER, {
    onError,
    onCompleted,
  });
};
