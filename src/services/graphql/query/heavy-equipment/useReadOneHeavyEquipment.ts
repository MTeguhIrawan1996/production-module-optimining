import { ApolloError, gql, useQuery } from '@apollo/client';

import { IFile } from '@/types/global';

export const READ_ONE_HEAVY_EQUIPMENT = gql`
  query ReadHeavyEquipmentReference($id: String!) {
    heavyEquipmentReference(id: $id) {
      id
      model {
        id
        name
        type {
          id
          name
          brand {
            id
            name
          }
        }
      }
      photos {
        id
        originalFileName
        url
        fileName
      }
      spec
      createdYear
    }
  }
`;

export interface IHeavyEquipmentReferenceData {
  id: string;
  model: {
    id: string;
    name: string;
    type: {
      id: string;
      name: string;
      brand: {
        id: string;
        name: string;
      };
    };
  };
  photos: Omit<IFile, 'mime' | 'path'>[] | null;
  spec: string;
  createdYear: string;
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
}: {
  variables: IHeavyEquipmentReferenceRequest;
  skip?: boolean;
  onCompleted?: (data: IHeavyEquipmentReferenceResponse) => void;
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
    fetchPolicy: 'cache-and-network',
  });

  return {
    heavyEquipmentReferenceData:
      heavyEquipmentReferenceData?.heavyEquipmentReference,
    heavyEquipmentReferenceDataLoading,
  };
};
