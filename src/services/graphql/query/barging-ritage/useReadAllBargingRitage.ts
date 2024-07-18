import {
  ApolloError,
  gql,
  useQuery,
  WatchQueryFetchPolicy,
} from '@apollo/client';

import { ILocationsData } from '@/services/graphql/query/location/useReadAllLocationMaster';
import { IMaterialsData } from '@/services/graphql/query/material/useReadAllMaterialMaster';
import { IStockpilesData } from '@/services/graphql/query/stockpile-master/useReadAllStockpileMaster';

import {
  GResponse,
  ICommonRitagesData,
  IGlobalMetaRequest,
  IGlobalTimeFIlter,
} from '@/types/global';

export const READ_ALL_RITAGE_BARGING = gql`
  query ReadAllRitageBarging(
    $page: Int
    $limit: Int
    $date: String
    $orderBy: String
    $orderDir: String
    $shiftId: String
    $stockpileId: String
    $domeId: String
    $companyHeavyEquipmentId: String
    $isRitageProblematic: Boolean
    $timeFilterType: TimeFilterTypeDownloadEnum
    $timeFilter: JSON
  ) {
    bargingRitages(
      findAllBargingRitageInput: {
        page: $page
        limit: $limit
        date: $date
        orderBy: $orderBy
        orderDir: $orderDir
        shiftId: $shiftId
        stockpileId: $stockpileId
        domeId: $domeId
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
        dome {
          id
          name
          stockpile {
            id
            name
          }
        }
        barging {
          id
          name
        }
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
  barging: Pick<ILocationsData, 'id' | 'name'> | null;
  dome: IDomeWithStockpile | null;
  sampleNumber: string | null;
  material: Pick<IMaterialsData, 'id' | 'name'> | null;
}

interface IBargingRitagesResponse {
  bargingRitages: GResponse<ICommonRitagesData<IOtherProps>>;
}

export interface IBargingRitagesRequest
  extends Omit<IGlobalMetaRequest, 'search'> {
  shiftId: string | null;
  stockpileId: string | null;
  domeId: string | null;
  isRitageProblematic: boolean | null;
  companyHeavyEquipmentId: string | null;
  timeFilterType: 'DATE_RANGE' | 'PERIOD' | null;
  timeFilter: Partial<IGlobalTimeFIlter>;
}

export const useReadAllRitageBarging = ({
  variables,
  onCompleted,
  skip,
  fetchPolicy = 'cache-first',
}: {
  variables?: Partial<IBargingRitagesRequest>;
  onCompleted?: (data: IBargingRitagesResponse) => void;
  skip?: boolean;
  fetchPolicy?: WatchQueryFetchPolicy;
}) => {
  const {
    data: bargingRitagesData,
    loading: bargingRitagesDataLoading,
    refetch,
  } = useQuery<IBargingRitagesResponse, Partial<IBargingRitagesRequest>>(
    READ_ALL_RITAGE_BARGING,
    {
      variables: variables,
      skip: skip,
      onError: (err: ApolloError) => {
        return err;
      },
      onCompleted,
      fetchPolicy,
      notifyOnNetworkStatusChange: true,
    }
  );

  return {
    bargingRitagesData: bargingRitagesData?.bargingRitages.data,
    bargingRitagesDataMeta: bargingRitagesData?.bargingRitages.meta,
    bargingRitagesDataLoading,
    refetchBargingRitages: refetch,
  };
};
