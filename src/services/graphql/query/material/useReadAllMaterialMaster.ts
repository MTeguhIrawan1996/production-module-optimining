import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_MATERIAL_MASTER = gql`
  query ReadAllMaterial(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
    $parentId: String
    $isHaveParent: Boolean
    $includeIds: [String!]
  ) {
    materials(
      findAllMaterialInput: {
        page: $page
        limit: $limit
        search: $search
        orderBy: $orderBy
        orderDir: $orderDir
        parentId: $parentId
        isHaveParent: $isHaveParent
        includeIds: $includeIds
      }
    ) {
      meta {
        currentPage
        totalPage
        totalData
        totalAllData
      }
      data {
        id
        name
        subMaterials {
          id
          name
        }
      }
    }
  }
`;

export interface ISubmaterials {
  id: string;
  name: string;
}

interface IMaterialsData {
  id: string;
  name: string;
  subMaterials: ISubmaterials[];
}

interface IMaterialsResponse {
  materials: GResponse<IMaterialsData>;
}

interface IMaterialsRequest extends Partial<IGlobalMetaRequest> {
  parentId?: string | null;
  isHaveParent?: boolean | null;
  includeIds?: string[];
}

export const useReadAllMaterialsMaster = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: IMaterialsRequest;
  onCompleted?: (data: IMaterialsResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: materialsData,
    loading: materialsDataLoading,
    refetch,
  } = useQuery<IMaterialsResponse, IMaterialsRequest>(
    READ_ALL_MATERIAL_MASTER,
    {
      variables: variables,
      skip: skip,
      onError: (err: ApolloError) => {
        return err;
      },
      onCompleted,
      fetchPolicy: 'cache-and-network',
    }
  );

  return {
    materialsData: materialsData?.materials.data,
    materialsDataMeta: materialsData?.materials.meta,
    materialsDataLoading,
    refetchMaterials: refetch,
  };
};
