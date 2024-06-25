import { ApolloError, gql, useQuery } from '@apollo/client';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_HEAVY_EQUIPMENT_SELECT = gql`
  query ReadAllHeavyEquipmentSelect(
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
    $isComplete: Boolean
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
        isComplete: $isComplete
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
        heavyEquipment {
          id
          vehicleNumber
          reference {
            id
            type {
              id
              category {
                id
                name
              }
            }
          }
        }
      }
    }
  }
`;

export interface IHeavyEquipmentSelect {
  id: string;
  hullNumber: string | null;
  heavyEquipment: {
    id: string;
    vehicleNumber: string;
    reference: {
      id: string;
      type: {
        id: string;
        category: {
          id: string;
          name: string;
        } | null;
      };
    };
  };
}

interface IHeavyEquipmentSelectResponse {
  companyHeavyEquipments: GResponse<IHeavyEquipmentSelect>;
}

interface IHeavyEquipmentSelectRequest extends Partial<IGlobalMetaRequest> {
  typeId?: string | null;
  brandId?: string | null;
  referenceId?: string | null;
  classId?: string | null;
  companyId?: string | null;
  categoryId?: string | null;
  isComplete?: boolean | null;
}

export const useReadAllHeavyEquipmentSelect = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: IHeavyEquipmentSelectRequest;
  onCompleted?: (data: IHeavyEquipmentSelectResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: heavyEquipmentSelect,
    loading: heavyEquipmentSelectLoading,
    refetch,
  } = useQuery<IHeavyEquipmentSelectResponse, IHeavyEquipmentSelectRequest>(
    READ_ALL_HEAVY_EQUIPMENT_SELECT,
    {
      variables: variables,
      skip: skip,
      onError: (err: ApolloError) => {
        return err;
      },
      onCompleted,
      fetchPolicy: 'cache-first',
    }
  );

  return {
    heavyEquipmentSelect: heavyEquipmentSelect?.companyHeavyEquipments.data,
    heavyEquipmentSelectMeta: heavyEquipmentSelect?.companyHeavyEquipments.meta,
    heavyEquipmentSelectLoading,
    refetchHeavyEquipmentSelect: refetch,
  };
};
