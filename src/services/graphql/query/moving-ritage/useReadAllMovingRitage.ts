import {
  ApolloError,
  gql,
  useQuery,
  WatchQueryFetchPolicy,
} from '@apollo/client';

import { IMaterialsData } from '@/services/graphql/query/material/useReadAllMaterialMaster';
import { IStockpilesData } from '@/services/graphql/query/stockpile-master/useReadAllStockpileMaster';

import {
  GResponse,
  ICommonRitagesData,
  IGlobalMetaRequest,
  IGlobalTimeFIlter,
} from '@/types/global';

export const READ_ALL_RITAGE_MOVING = gql`
  query ReadAllRitageMoving(
    $page: Int
    $limit: Int
    $date: String
    $orderBy: String
    $orderDir: String
    $shiftId: String
    $companyHeavyEquipmentId: String
    $isRitageProblematic: Boolean
    $timeFilterType: TimeFilterTypeDownloadEnum
    $timeFilter: JSON
  ) {
    movingRitages(
      findAllMovingRitageInput: {
        page: $page
        limit: $limit
        date: $date
        orderBy: $orderBy
        orderDir: $orderDir
        shiftId: $shiftId
        companyHeavyEquipmentId: $companyHeavyEquipmentId
        isRitageProblematic: $isRitageProblematic
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
        shift {
          id
          name
        }
        companyHeavyEquipment {
          id
          hullNumber
        }
        material {
          name
        }
        subMaterial {
          id
          name
        }
        fromAt
        arriveAt
        fromDome {
          id
          name
        }
        toDome {
          id
          name
          stockpile {
            id
            name
          }
        }
        tonByRitage
        sampleNumber
        status {
          id
          name
          color
        }
        isComplete
        isRitageProblematic
      }
    }
  }
`;

type IDomeWithStockpile =
  | {
      stockpile: Pick<IStockpilesData, 'id' | 'name'> | null;
    } & Pick<IStockpilesData, 'id' | 'name'>;

interface IOtherProps {
  material: Pick<IMaterialsData, 'id' | 'name'> | null;
  fromDome: Pick<IStockpilesData, 'id' | 'name'> | null;
  toDome: IDomeWithStockpile | null;
  sampleNumber: string | null;
  tonByRitage: number | null;
}

interface IReadAllRitageMovingResponse {
  movingRitages: GResponse<ICommonRitagesData<IOtherProps>>;
}

export interface IReadAllRitageMovingRequest
  extends Omit<IGlobalMetaRequest, 'search'> {
  shiftId: string | null;
  isRitageProblematic: boolean | null;
  companyHeavyEquipmentId: string | null;
  timeFilterType: 'DATE_RANGE' | 'PERIOD' | null;
  timeFilter: Partial<IGlobalTimeFIlter>;
}

export const useReadAllRitageMoving = ({
  variables,
  onCompleted,
  skip,
  fetchPolicy = 'cache-first',
}: {
  variables?: Partial<IReadAllRitageMovingRequest>;
  onCompleted?: (data: IReadAllRitageMovingResponse) => void;
  skip?: boolean;
  fetchPolicy?: WatchQueryFetchPolicy;
}) => {
  const {
    data: movingRitagesData,
    loading: movingRitagesDataLoading,
    refetch,
  } = useQuery<
    IReadAllRitageMovingResponse,
    Partial<IReadAllRitageMovingRequest>
  >(READ_ALL_RITAGE_MOVING, {
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
    movingRitagesData: movingRitagesData?.movingRitages.data,
    movingRitagesDataMeta: movingRitagesData?.movingRitages.meta,
    movingRitagesDataLoading,
    refetchMovingRitages: refetch,
  };
};
