import {
  ApolloError,
  gql,
  useQuery,
  WatchQueryFetchPolicy,
} from '@apollo/client';

import { IShiftsData } from '@/services/graphql/query/shift/useReadAllShiftMaster';

import { GResponse, IGlobalMetaRequest, IStatus } from '@/types/global';

export const READ_ALL_HEAVY_EQUIPMENT_PRODUCTION = gql`
  query ReadAllHeavyEquipmentProduction(
    $page: Int
    $limit: Int
    $search: String
    $date: String
    $orderBy: String
    $orderDir: String
    $shiftId: String
    $statusId: String
    $foremanId: String
    $operatorId: String
    $companyHeavyEquipmentId: String
  ) {
    heavyEquipmentDatas(
      findAllHeavyEquipmentDataInput: {
        page: $page
        limit: $limit
        date: $date
        orderBy: $orderBy
        search: $search
        orderDir: $orderDir
        shiftId: $shiftId
        statusId: $statusId
        foremanId: $foremanId
        operatorId: $operatorId
        companyHeavyEquipmentId: $companyHeavyEquipmentId
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
        date
        companyHeavyEquipment {
          id
          hullNumber
          heavyEquipment {
            id
            engineNumber
            reference {
              id
              type {
                id
                name
              }
            }
          }
        }
        shift {
          id
          name
        }
        foreman {
          id
          nip
          humanResource {
            id
            name
          }
        }
        operator {
          id
          nip
          humanResource {
            id
            name
          }
        }
        status {
          id
          color
          name
        }
      }
    }
  }
`;

interface IReadAllHeavyEquipmentProductionData {
  id: string;
  date: string | null;
  companyHeavyEquipment: {
    id: string;
    hullNumber: string | null;
    heavyEquipment: {
      id: string;
      reference: {
        id: string;
        type: {
          id: string;
          name: string;
        };
      };
    };
  };
  shift: Pick<IShiftsData, 'id' | 'name'> | null;
  foreman: {
    id: string;
    nip: string | null;
    humanResource: {
      id: string;
      name: string;
    };
  };
  operator: {
    id: string;
    nip: string | null;
    humanResource: {
      id: string;
      name: string;
    };
  };
  status: IStatus | null;
}

interface IReadAllHeavyEquipmentProductionResponse {
  heavyEquipmentDatas: GResponse<IReadAllHeavyEquipmentProductionData>;
}

interface IReadAllHeavyEquipmentProductionRequest
  extends Partial<IGlobalMetaRequest> {
  date?: string | null;
  shiftId?: string | null;
  statusId?: string | null;
  foremanId?: string | null;
  operatorId?: string | null;
  companyHeavyEquipmentId?: string | null;
}

export const useReadAllHeavyEquipmentProduction = ({
  variables,
  onCompleted,
  skip,
  fetchPolicy = 'cache-first',
}: {
  variables?: IReadAllHeavyEquipmentProductionRequest;
  onCompleted?: (data: IReadAllHeavyEquipmentProductionResponse) => void;
  skip?: boolean;
  fetchPolicy?: WatchQueryFetchPolicy;
}) => {
  const {
    data: heavyEquipmentDatasData,
    loading: heavyEquipmentDatasDataLoading,
    refetch,
  } = useQuery<
    IReadAllHeavyEquipmentProductionResponse,
    IReadAllHeavyEquipmentProductionRequest
  >(READ_ALL_HEAVY_EQUIPMENT_PRODUCTION, {
    variables: variables,
    skip: skip,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted,
    fetchPolicy,
  });

  return {
    heavyEquipmentData: heavyEquipmentDatasData?.heavyEquipmentDatas.data,
    heavyEquipmentDataMeta: heavyEquipmentDatasData?.heavyEquipmentDatas.meta,
    heavyEquipmentDataLoading: heavyEquipmentDatasDataLoading,
    refetchHeavyEquipmentData: refetch,
  };
};
