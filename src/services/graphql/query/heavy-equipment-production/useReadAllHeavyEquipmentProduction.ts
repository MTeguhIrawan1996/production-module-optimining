import {
  ApolloError,
  gql,
  useQuery,
  WatchQueryFetchPolicy,
} from '@apollo/client';

import { IShiftsData } from '@/services/graphql/query/shift/useReadAllShiftMaster';

import {
  GResponse,
  IGlobalMetaRequest,
  IGlobalTimeFIlter,
  IStatus,
} from '@/types/global';

export const READ_ALL_HEAVY_EQUIPMENT_PRODUCTION = gql`
  query ReadAllHeavyEquipmentProduction(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
    $shiftId: String
    # $statusId: String
    # $foremanId: String
    # $operatorId: String
    $companyHeavyEquipmentId: String
    $timeFilterType: TimeFilterTypeDownloadEnum
    $timeFilter: JSON
  ) {
    heavyEquipmentDatas(
      findAllHeavyEquipmentDataInput: {
        page: $page
        limit: $limit
        orderBy: $orderBy
        search: $search
        orderDir: $orderDir
        shiftId: $shiftId
        # statusId: $statusId
        # foremanId: $foremanId
        # operatorId: $operatorId
        companyHeavyEquipmentId: $companyHeavyEquipmentId
        timeFilterType: $timeFilterType
        timeFilter: $timeFilter
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
        isHeavyEquipmentProblematic
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
  isHeavyEquipmentProblematic: boolean;
  status: IStatus | null;
}

interface IReadAllHeavyEquipmentProductionResponse {
  heavyEquipmentDatas: GResponse<IReadAllHeavyEquipmentProductionData>;
}

export interface IReadAllHeavyEquipmentProductionRequest
  extends IGlobalMetaRequest {
  shiftId: string | null;
  companyHeavyEquipmentId: string | null;
  timeFilterType: 'DATE_RANGE' | 'PERIOD' | null;
  timeFilter: Partial<IGlobalTimeFIlter>;
}

export const useReadAllHeavyEquipmentProduction = ({
  variables,
  onCompleted,
  skip,
  fetchPolicy = 'cache-first',
}: {
  variables?: Partial<IReadAllHeavyEquipmentProductionRequest>;
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
    Partial<IReadAllHeavyEquipmentProductionRequest>
  >(READ_ALL_HEAVY_EQUIPMENT_PRODUCTION, {
    variables: variables,
    skip: skip,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted,
    fetchPolicy,
    notifyOnNetworkStatusChange: true,
  });

  return {
    heavyEquipmentData: heavyEquipmentDatasData?.heavyEquipmentDatas.data,
    heavyEquipmentDataMeta: heavyEquipmentDatasData?.heavyEquipmentDatas.meta,
    heavyEquipmentDataLoading: heavyEquipmentDatasDataLoading,
    refetchHeavyEquipmentData: refetch,
  };
};
