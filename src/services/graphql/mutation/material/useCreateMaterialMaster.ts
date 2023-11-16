import { ApolloError, gql, useMutation } from '@apollo/client';

export const CREATE_MATERIAL_MASTER = gql`
  mutation CreateMaterialMaster($name: String!, $parentId: String!) {
    createMaterial(createMaterialInput: { name: $name, parentId: $parentId }) {
      id
    }
  }
`;

export interface IMutationMaterialValues {
  name: string;
  parentId: string | null;
}

type ICreateMaterialMasterRequest = IMutationMaterialValues;

interface ICreateMaterialMasterResponse {
  createMaterial: {
    id: string;
  };
}

export const useCreateMaterialMaster = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: ICreateMaterialMasterResponse) => void;
}) => {
  return useMutation<
    ICreateMaterialMasterResponse,
    ICreateMaterialMasterRequest
  >(CREATE_MATERIAL_MASTER, {
    onError,
    onCompleted,
  });
};
