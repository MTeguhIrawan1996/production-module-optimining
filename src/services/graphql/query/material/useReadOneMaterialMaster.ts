import { ApolloError, gql, useQuery } from '@apollo/client';

import { ISubmaterials } from '@/services/graphql/query/material/useReadAllMaterialMaster';

export const READ_ONE_MATERIAL_MASTER = gql`
  query ReadOneMaterialMaster($id: String!) {
    material(id: $id) {
      id
      name
      parent {
        id
        name
      }
      subMaterials {
        id
        name
      }
    }
  }
`;

export interface IReadOneMaterialMaster {
  id: string;
  name: string;
  parent: {
    id: string;
    name: string;
  } | null;
  subMaterials: ISubmaterials[];
}

export interface IReadOneMaterialMasterResponse {
  material: IReadOneMaterialMaster;
}

export interface IReadOneMaterialMasterRequest {
  id: string;
}

export const useReadOneMaterialMaster = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: IReadOneMaterialMasterRequest;
  skip?: boolean;
  onCompleted?: (data: IReadOneMaterialMasterResponse) => void;
}) => {
  const { data: materialMaster, loading: materialMasterLoading } = useQuery<
    IReadOneMaterialMasterResponse,
    IReadOneMaterialMasterRequest
  >(READ_ONE_MATERIAL_MASTER, {
    variables,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted: onCompleted,
    skip,
    fetchPolicy: 'cache-and-network',
  });

  return {
    materialMaster: materialMaster?.material,
    materialMasterLoading,
  };
};
