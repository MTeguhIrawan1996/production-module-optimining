import { ApolloError, gql, useMutation } from '@apollo/client';

import { IMutationMaterialValues } from '@/services/graphql/mutation/material/useCreateMaterialMaster';

export const UPDATE_MATERIAL_MASTER = gql`
  mutation UpdateMaterialMaster(
    $id: String!
    $name: String!
    $parentId: String
  ) {
    updateMaterial(
      updateMaterialInput: { id: $id, name: $name, parentId: $parentId }
    ) {
      id
    }
  }
`;

type IUpdateMaterialMasterRequest = {
  id: string;
} & IMutationMaterialValues;

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
