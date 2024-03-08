import {
  ApolloError,
  gql,
  useQuery,
  WatchQueryFetchPolicy,
} from '@apollo/client';

import { IHeavyEquipmentMasterData } from '@/services/graphql/query/heavy-equipment/useReadAllHeavyEquipmentMasterData';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_HEAVY_EQUIPMENT_COMPANY = gql`
  query ReadAllHeavyEquipmentCompany(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
    $companyId: String
    $typeId: String
    $brandId: String
    $referenceId: String
    $classId: String
    $categoryId: String
  ) {
    companyHeavyEquipments(
      findAllCompanyHeavyEquipmentInput: {
        page: $page
        limit: $limit
        search: $search
        orderBy: $orderBy
        orderDir: $orderDir
        typeId: $typeId
        brandId: $brandId
        companyId: $companyId
        referenceId: $referenceId
        classId: $classId
        categoryId: $categoryId
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
        hullNumber
        isComplete
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
        }
      }
    }
  }
`;

interface IHeavyEquipmentCompanyData {
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
      } & IHeavyEquipmentMasterData)
    | null;
}

export interface IHeavyEquipmentCompany extends IHeavyEquipmentCompanyData {
  id: string;
  hullNumber: string | null;
  isComplete: boolean;
}

interface IHeavyEquipmentCompanyResponse {
  companyHeavyEquipments: GResponse<IHeavyEquipmentCompany>;
}

interface IHeavyEquipmentCompanyRequest extends Partial<IGlobalMetaRequest> {
  typeId?: string | null;
  brandId?: string | null;
  referenceId?: string | null;
  classId?: string | null;
  companyId?: string | null;
  categoryId?: string | null;
}

export const useReadAllHeavyEquipmentCompany = ({
  variables,
  onCompleted,
  skip,
  fetchPolicy = 'cache-first',
}: {
  variables?: IHeavyEquipmentCompanyRequest;
  onCompleted?: (data: IHeavyEquipmentCompanyResponse) => void;
  skip?: boolean;
  fetchPolicy?: WatchQueryFetchPolicy;
}) => {
  const {
    data: heavyEquipmentCompany,
    loading: heavyEquipmentCompanyLoading,
    refetch,
  } = useQuery<IHeavyEquipmentCompanyResponse, IHeavyEquipmentCompanyRequest>(
    READ_ALL_HEAVY_EQUIPMENT_COMPANY,
    {
      variables: variables,
      skip: skip,
      onError: (err: ApolloError) => {
        return err;
      },
      onCompleted,
      fetchPolicy,
    }
  );

  return {
    heavyEquipmentsCompany: heavyEquipmentCompany?.companyHeavyEquipments.data,
    heavyEquipmentsCompanyMeta:
      heavyEquipmentCompany?.companyHeavyEquipments.meta,
    heavyEquipmentCompanyLoading,
    refetchHeavyEquipmentCompany: refetch,
  };
};
