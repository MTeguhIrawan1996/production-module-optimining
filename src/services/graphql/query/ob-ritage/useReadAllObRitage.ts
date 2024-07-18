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

export const READ_ALL_RITAGE_OB = gql`
  query ReadAllRitageOB(
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
    overburdenRitages(
      findAllOverburdenRitageInput: {
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
        # subMaterial {
        #   id
        #   name
        # }
        fromAt
        arriveAt
        fromPit {
          id
          name
        }
        disposal {
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

interface IOtherProps {
  disposal: Pick<ILocationsData, 'id' | 'name'> | null;
  fromPit: Pick<ILocationsData, 'id' | 'name'> | null;
  material: Pick<IMaterialsData, 'id' | 'name'> | null;
}

interface IOverburdenRitagesResponse {
  overburdenRitages: GResponse<ICommonRitagesData<IOtherProps>>;
}

export interface IOverburdenRitagesRequest
  extends Omit<IGlobalMetaRequest, 'search'> {
  shiftId?: string | null;
  isRitageProblematic?: boolean | null;
  companyHeavyEquipmentId?: string | null;
  fromPitId: string | null;
  timeFilterType: 'DATE_RANGE' | 'PERIOD' | null;
  timeFilter: Partial<IGlobalTimeFIlter>;
}

export const useReadAllRitageOB = ({
  variables,
  onCompleted,
  onError,
  skip,
  fetchPolicy = 'cache-first',
}: {
  variables?: Partial<IOverburdenRitagesRequest>;
  onCompleted?: (data: IOverburdenRitagesResponse) => void;
  onError?: ({ graphQLErrors }: ApolloError) => void;
  skip?: boolean;
  fetchPolicy?: WatchQueryFetchPolicy;
}) => {
  const {
    data: overburdenRitagesData,
    loading: overburdenRitagesDataLoading,
    refetch,
  } = useQuery<IOverburdenRitagesResponse, Partial<IOverburdenRitagesRequest>>(
    READ_ALL_RITAGE_OB,
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
    overburdenRitagesData: overburdenRitagesData?.overburdenRitages.data,
    overburdenRitagesDataMeta: overburdenRitagesData?.overburdenRitages.meta,
    overburdenRitagesDataLoading,
    refetchOverburdenRitages: refetch,
  };
};
