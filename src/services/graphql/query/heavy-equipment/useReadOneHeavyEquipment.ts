import {
  ApolloError,
  gql,
  useQuery,
  WatchQueryFetchPolicy,
} from '@apollo/client';

import { IFile } from '@/types/global';

export const READ_ONE_HEAVY_EQUIPMENT = gql`
  query ReadOneHeavyEquipmentReference($id: String!) {
    heavyEquipmentReference(id: $id) {
      id
      modelName
      type {
        id
        name
        brand {
          id
          name
        }
      }
      photos {
        id
        originalFileName
        url
        fileName
      }
      spec
      modelYear
    }
  }
`;

export interface IHeavyEquipmentReferenceData {
  id: string;
  modelName: string;
  type: {
    id: string;
    name: string;
    brand: {
      id: string;
      name: string;
    };
  };
  spec: string | null;
  modelYear: string;
  photos: Omit<IFile, 'mime' | 'path'>[] | null;
}

export interface IHeavyEquipmentReferenceResponse {
  heavyEquipmentReference: IHeavyEquipmentReferenceData;
}

export interface IHeavyEquipmentReferenceRequest {
  id: string;
}

export const useReadOneHeavyEquipmentReference = ({
  variables,
  skip,
  onCompleted,
  fetchPolicy = 'cache-and-network',
}: {
  variables: IHeavyEquipmentReferenceRequest;
  skip?: boolean;
  onCompleted?: (data: IHeavyEquipmentReferenceResponse) => void;
  fetchPolicy?: WatchQueryFetchPolicy;
}) => {
  const {
    data: heavyEquipmentReferenceData,
    loading: heavyEquipmentReferenceDataLoading,
  } = useQuery<
    IHeavyEquipmentReferenceResponse,
    IHeavyEquipmentReferenceRequest
  >(READ_ONE_HEAVY_EQUIPMENT, {
    variables,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted: onCompleted,
    skip,
    fetchPolicy,
  });

  return {
    heavyEquipmentReferenceData:
      heavyEquipmentReferenceData?.heavyEquipmentReference,
    heavyEquipmentReferenceDataLoading,
  };
};
