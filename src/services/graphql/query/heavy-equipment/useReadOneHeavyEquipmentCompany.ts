import { ApolloError, gql, useQuery } from '@apollo/client';

import { IHeavyEquipmentMasterData } from '@/services/graphql/query/heavy-equipment/useReadAllHeavyEquipmentMasterData';

import { IFile } from '@/types/global';

export const READ_ONE_HEAVY_EQUIPMENT_COMPANY = gql`
  query ReadOneHeavyEquipmentCompany($id: String!) {
    companyHeavyEquipment(id: $id) {
      id
      hullNumber
      startDate
      endDate
      isStill
      heavyEquipment {
        id
        engineNumber
        chassisNumber
        reference {
          id
          modelName
          spec
          type {
            id
            name
            brand {
              id
              name
            }
          }
        }
        createdYear
        class {
          id
          name
        }
        eligibilityStatus {
          id
          name
        }
        vehicleNumber
        vehicleNumberPhoto {
          id
          fileName
          url
          originalFileName
        }
        photos {
          id
          fileName
          url
          originalFileName
        }
      }
    }
  }
`;

export interface IReadOneHeavyEquipmentCompanyData {
  id: string;
  hullNumber: string | null;
  isComplete: boolean;
  startDate: string;
  endDate: string | null;
  isStill: boolean;
  heavyEquipment:
    | ({
        class: {
          id: string;
          name: string;
        } | null;
        eligibilityStatus: {
          id: string;
          name: string | null;
        } | null;
        vehicleNumber: string;
        vehicleNumberPhoto: Omit<IFile, 'mime' | 'path'> | null;
        photos: Omit<IFile, 'mime' | 'path'>[] | null;
      } & IHeavyEquipmentMasterData)
    | null;
}

export interface IReadOneHeavyEquipmentCompanyResponse {
  companyHeavyEquipment: IReadOneHeavyEquipmentCompanyData;
}

export interface IReadOneHeavyEquipmentCompanyRequest {
  id: string;
}

export const useReadOneHeavyEquipmentCompany = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: IReadOneHeavyEquipmentCompanyRequest;
  skip?: boolean;
  onCompleted?: (data: IReadOneHeavyEquipmentCompanyResponse) => void;
}) => {
  const {
    data: heavyEquipmentCompanyData,
    loading: heavyEquipmentCompanyDataLoading,
  } = useQuery<
    IReadOneHeavyEquipmentCompanyResponse,
    IReadOneHeavyEquipmentCompanyRequest
  >(READ_ONE_HEAVY_EQUIPMENT_COMPANY, {
    variables,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted: onCompleted,
    skip,
    fetchPolicy: 'cache-and-network',
  });

  return {
    heavyEquipmentCompanyData: heavyEquipmentCompanyData?.companyHeavyEquipment,
    heavyEquipmentCompanyDataLoading,
  };
};
