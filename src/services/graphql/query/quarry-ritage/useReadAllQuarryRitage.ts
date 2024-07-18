import {
  ApolloError,
  gql,
  useQuery,
  WatchQueryFetchPolicy,
} from '@apollo/client';

import { ILocationsData } from '@/services/graphql/query/location/useReadAllLocationMaster';
import { IMaterialsData } from '@/services/graphql/query/material/useReadAllMaterialMaster';

import {
  GResponse,
  ICommonRitagesData,
  IGlobalMetaRequest,
  IGlobalTimeFIlter,
} from '@/types/global';

export const READ_ALL_RITAGE_QUARRY = gql`
  query ReadAllRitageQuarry(
    $page: Int
    $limit: Int
    $orderBy: String
    $orderDir: String
    $shiftId: String
    $companyHeavyEquipmentId: String
    $isRitageProblematic: Boolean
    $fromPitId: String
    $timeFilterType: TimeFilterTypeDownloadEnum
    $timeFilter: JSON
  ) {
    quarryRitages(
      findAllQuarryRitageInput: {
        page: $page
        limit: $limit
        orderBy: $orderBy
        orderDir: $orderDir
        shiftId: $shiftId
        companyHeavyEquipmentId: $companyHeavyEquipmentId
        isRitageProblematic: $isRitageProblematic
        fromPitId: $fromPitId
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
          id
          name
        }
        subMaterial {
          id
          name
        }
        fromAt
        arriveAt
        fromPit {
          id
          name
        }
        toLocation {
          id
          name
        }
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

interface IOtherQuaryRitgaeProps {
  fromPit: Pick<ILocationsData, 'id' | 'name'> | null;
  toLocation: Pick<ILocationsData, 'id' | 'name'> | null;
  material: Pick<IMaterialsData, 'id' | 'name'> | null;
}

interface IQuarryRitagesResponse {
  quarryRitages: GResponse<ICommonRitagesData<IOtherQuaryRitgaeProps>>;
}

export interface IQuarryRitagesRequest
  extends Omit<IGlobalMetaRequest, 'search'> {
  shiftId?: string | null;
  isRitageProblematic?: boolean | null;
  companyHeavyEquipmentId?: string | null;
  fromPitId: string | null;
  timeFilterType: 'DATE_RANGE' | 'PERIOD' | null;
  timeFilter: Partial<IGlobalTimeFIlter>;
}

export const useReadAllRitageQuarry = ({
  variables,
  onCompleted,
  onError,
  skip,
  fetchPolicy = 'cache-first',
}: {
  variables?: Partial<IQuarryRitagesRequest>;
  onCompleted?: (data: IQuarryRitagesResponse) => void;
  onError?: ({ graphQLErrors }: ApolloError) => void;
  skip?: boolean;
  fetchPolicy?: WatchQueryFetchPolicy;
}) => {
  const {
    data: quarryRitagesData,
    loading: quarryRitagesDataLoading,
    refetch,
  } = useQuery<IQuarryRitagesResponse, Partial<IQuarryRitagesRequest>>(
    READ_ALL_RITAGE_QUARRY,
    {
      variables: variables,
      skip: skip,
      onError,
      onCompleted,
      fetchPolicy,
      notifyOnNetworkStatusChange: true,
    }
  );

  return {
    quarryRitagesData: quarryRitagesData?.quarryRitages.data,
    quarryRitagesDataMeta: quarryRitagesData?.quarryRitages.meta,
    quarryRitagesDataLoading,
    refetchQuarryRitages: refetch,
  };
};
