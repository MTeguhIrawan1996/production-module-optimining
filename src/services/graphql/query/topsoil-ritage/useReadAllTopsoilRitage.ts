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

export const READ_ALL_RITAGE_TOPSOIL = gql`
  query ReadAllRitageTopsoil(
    $page: Int
    $limit: Int
    $orderBy: String
    $orderDir: String
    $shiftId: String
    $companyHeavyEquipmentId: String
    $isRitageProblematic: Boolean
    $timeFilterType: TimeFilterTypeDownloadEnum
    $timeFilter: JSON
  ) {
    topsoilRitages(
      findAllTopsoilRitageInput: {
        page: $page
        limit: $limit
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
          id
          name
        }
        subMaterial {
          id
          name
        }
        fromAt
        arriveAt
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
  toLocation: Pick<ILocationsData, 'id' | 'name'> | null;
  material: Pick<IMaterialsData, 'id' | 'name'> | null;
}

interface ITopsoilRitagesResponse {
  topsoilRitages: GResponse<ICommonRitagesData<IOtherQuaryRitgaeProps>>;
}

export interface ITopsoilRitagesRequest
  extends Omit<IGlobalMetaRequest, 'search'> {
  shiftId: string | null;
  isRitageProblematic: boolean | null;
  companyHeavyEquipmentId: string | null;
  timeFilterType: 'DATE_RANGE' | 'PERIOD' | null;
  timeFilter: Partial<IGlobalTimeFIlter>;
}

export const useReadAllRitageTopsoil = ({
  variables,
  onCompleted,
  onError,
  skip,
  fetchPolicy = 'cache-first',
}: {
  variables?: Partial<ITopsoilRitagesRequest>;
  onCompleted?: (data: ITopsoilRitagesResponse) => void;
  onError?: ({ graphQLErrors }: ApolloError) => void;
  skip?: boolean;
  fetchPolicy?: WatchQueryFetchPolicy;
}) => {
  const {
    data: topsoilRitagesData,
    loading: topsoilRitagesDataLoading,
    refetch,
  } = useQuery<ITopsoilRitagesResponse, Partial<ITopsoilRitagesRequest>>(
    READ_ALL_RITAGE_TOPSOIL,
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
    topsoilRitagesData: topsoilRitagesData?.topsoilRitages.data,
    topsoilRitagesDataMeta: topsoilRitagesData?.topsoilRitages.meta,
    topsoilRitagesDataLoading,
    refetchTopsoilRitages: refetch,
  };
};
